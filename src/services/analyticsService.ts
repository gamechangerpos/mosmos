import { logEvent } from 'firebase/analytics';
import { doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { analytics, db } from '../lib/firebase';
import { AnalyticsEvent } from '../types';
import { StorageService } from './storageService';

const SESSION_KEY = 'mos_mos_analytics_session_id';
const ANALYTICS_LOCAL_KEY = 'mos_mos_analytics_local_data_v1';

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  visitorsToday: number;
  visitorsThisWeek: number;
  visitorsThisMonth: number;
  visitorsThisYear: number;
  pageViews: number;
  inquiryCount: number;
  bookingCount: number;
  conversionRate: number;
  topPages: { path: string; label: string; views: number }[];
  topDestinations: { name: string; views: number }[];
  topTours: { name: string; views: number }[];
  dailyTrends: { date: string; visitors: number; pageViews: number; conversions: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  browserBreakdown: { browser: string; count: number; percentage: number }[];
  referralSources: { source: string; count: number }[];
}

// Generate or retrieve session ID for unique visitor estimation
function getSessionId(): { id: string; isNewSession: boolean } {
  if (typeof window === 'undefined') return { id: 'ssr', isNewSession: false };
  let sessId = sessionStorage.getItem(SESSION_KEY);
  let isNew = false;
  if (!sessId) {
    sessId = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    sessionStorage.setItem(SESSION_KEY, sessId);
    isNew = true;
  }
  return { id: sessId, isNewSession: isNew };
}

// Device detection helper
function getDeviceCategory(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// Browser detection helper
function getBrowserCategory(): string {
  if (typeof window === 'undefined') return 'Other';
  const ua = navigator.userAgent;
  if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1 && ua.indexOf('OPR') === -1) return 'Chrome';
  if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari';
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  if (ua.indexOf('Edg') > -1) return 'Edge';
  return 'Other';
}

// Referrer category helper
function getReferrerCategory(): string {
  if (typeof window === 'undefined') return 'Direct';
  const ref = document.referrer;
  if (!ref) return 'Direct';
  if (ref.includes('google.')) return 'Google Search';
  if (ref.includes('bing.') || ref.includes('yahoo.')) return 'Organic Search';
  if (ref.includes('instagram.') || ref.includes('facebook.') || ref.includes('t.co') || ref.includes('twitter.')) return 'Social Media';
  return 'Referral';
}

// Today date string: YYYY-MM-DD
function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export const AnalyticsService = {
  // ============================================================================
  // 1. EVENT TRACKING
  // ============================================================================
  trackPageView(path: string, pageTitle?: string): void {
    const { id: sessionId, isNewSession } = getSessionId();
    const today = getTodayDateString();
    const device = getDeviceCategory();
    const browser = getBrowserCategory();
    const referrer = getReferrerCategory();

    // 1. Log to Firebase / Google Analytics 4 (if enabled)
    try {
      if (analytics) {
        logEvent(analytics, 'page_view', {
          page_path: path,
          page_title: pageTitle || document.title,
          device_category: device
        });
      }
    } catch {}

    // 2. Aggregate in Local Storage for instant visual dashboard
    this.recordLocalAggregate({
      path,
      today,
      sessionId,
      isNewSession,
      device,
      browser,
      referrer
    });

    // 3. Batched/Aggregated Firestore daily counter (throttled to avoid per-refresh cost)
    if (isNewSession) {
      this.syncDailyToFirestore(today, device, browser, referrer).catch(() => {});
    }
  },

  trackDestinationView(destinationSlug: string, destinationName: string): void {
    try {
      if (analytics) {
        logEvent(analytics, 'destination_view' as any, {
          destination_slug: destinationSlug,
          destination_name: destinationName
        });
      }
    } catch {}

    this.recordDestinationViewLocal(destinationName);
  },

  trackTourView(tourSlug: string, tourTitle: string): void {
    try {
      if (analytics) {
        logEvent(analytics, 'tour_view' as any, {
          tour_slug: tourSlug,
          tour_title: tourTitle
        });
      }
    } catch {}

    this.recordTourViewLocal(tourTitle);
  },

  trackConversion(type: 'inquiry' | 'booking', reference: string): void {
    try {
      if (analytics) {
        logEvent(analytics, type === 'inquiry' ? 'inquiry_submitted' as any : 'booking_submitted' as any, {
          reference
        });
      }
    } catch {}

    this.recordConversionLocal(type);
  },

  // ============================================================================
  // 2. LOCAL AGGREGATE STORAGE & RETRIEVAL (100% REAL DATA ONLY)
  // ============================================================================
  getInitialAnalyticsData() {
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      inquiryCount: 0,
      bookingCount: 0,
      pageCounts: {} as Record<string, number>,
      destinationCounts: {} as Record<string, number>,
      tourCounts: {} as Record<string, number>,
      deviceCounts: {} as Record<string, number>,
      browserCounts: {} as Record<string, number>,
      referrerCounts: {} as Record<string, number>,
      dailyStats: {} as Record<string, { visitors: number; pageViews: number; conversions: number }>
    };
  },

  getStoredData(): any {
    try {
      const stored = localStorage.getItem(ANALYTICS_LOCAL_KEY);
      if (!stored) {
        const fresh = this.getInitialAnalyticsData();
        localStorage.setItem(ANALYTICS_LOCAL_KEY, JSON.stringify(fresh));
        return fresh;
      }
      const raw = JSON.parse(stored);
      // Purge any stale mock baseline data (e.g. 184 visits, 682 pageViews) from previous sessions
      if (raw.totalVisits === 184 || raw.pageViews === 682 || !raw.dailyStats) {
        const fresh = this.getInitialAnalyticsData();
        localStorage.setItem(ANALYTICS_LOCAL_KEY, JSON.stringify(fresh));
        return fresh;
      }
      return raw;
    } catch {
      return this.getInitialAnalyticsData();
    }
  },

  recordLocalAggregate(data: {
    path: string;
    today: string;
    sessionId: string;
    isNewSession: boolean;
    device: string;
    browser: string;
    referrer: string;
  }): void {
    try {
      const raw = this.getStoredData();

      raw.pageViews = (raw.pageViews || 0) + 1;
      if (data.isNewSession) {
        raw.totalVisits = (raw.totalVisits || 0) + 1;
        raw.uniqueVisitors = (raw.uniqueVisitors || 0) + 1;
      }

      // Page counts
      if (!raw.pageCounts) raw.pageCounts = {};
      raw.pageCounts[data.path] = (raw.pageCounts[data.path] || 0) + 1;

      // Device counts
      if (!raw.deviceCounts) raw.deviceCounts = {};
      raw.deviceCounts[data.device] = (raw.deviceCounts[data.device] || 0) + 1;

      // Browser counts
      if (!raw.browserCounts) raw.browserCounts = {};
      raw.browserCounts[data.browser] = (raw.browserCounts[data.browser] || 0) + 1;

      // Referrer counts
      if (!raw.referrerCounts) raw.referrerCounts = {};
      raw.referrerCounts[data.referrer] = (raw.referrerCounts[data.referrer] || 0) + 1;

      // Daily trend
      if (!raw.dailyStats) raw.dailyStats = {};
      if (!raw.dailyStats[data.today]) {
        raw.dailyStats[data.today] = { visitors: 0, pageViews: 0, conversions: 0 };
      }
      raw.dailyStats[data.today].pageViews += 1;
      if (data.isNewSession) {
        raw.dailyStats[data.today].visitors += 1;
      }

      localStorage.setItem(ANALYTICS_LOCAL_KEY, JSON.stringify(raw));
    } catch (err) {
      console.warn('[Analytics] Local storage record error:', err);
    }
  },

  recordDestinationViewLocal(destinationName: string): void {
    try {
      const raw = this.getStoredData();
      if (!raw.destinationCounts) raw.destinationCounts = {};
      raw.destinationCounts[destinationName] = (raw.destinationCounts[destinationName] || 0) + 1;
      localStorage.setItem(ANALYTICS_LOCAL_KEY, JSON.stringify(raw));
    } catch {}
  },

  recordTourViewLocal(tourTitle: string): void {
    try {
      const raw = this.getStoredData();
      if (!raw.tourCounts) raw.tourCounts = {};
      raw.tourCounts[tourTitle] = (raw.tourCounts[tourTitle] || 0) + 1;
      localStorage.setItem(ANALYTICS_LOCAL_KEY, JSON.stringify(raw));
    } catch {}
  },

  recordConversionLocal(type: 'inquiry' | 'booking'): void {
    try {
      const today = getTodayDateString();
      const raw = this.getStoredData();
      if (type === 'inquiry') raw.inquiryCount = (raw.inquiryCount || 0) + 1;
      if (type === 'booking') raw.bookingCount = (raw.bookingCount || 0) + 1;

      if (!raw.dailyStats) raw.dailyStats = {};
      if (!raw.dailyStats[today]) {
        raw.dailyStats[today] = { visitors: 1, pageViews: 1, conversions: 0 };
      }
      raw.dailyStats[today].conversions += 1;

      localStorage.setItem(ANALYTICS_LOCAL_KEY, JSON.stringify(raw));
    } catch {}
  },

  async syncDailyToFirestore(today: string, device: string, browser: string, referrer: string): Promise<void> {
    try {
      const dailyDoc = doc(db, 'analyticsDaily', today);
      await setDoc(dailyDoc, {
        date: today,
        visitors: increment(1),
        [`devices.${device}`]: increment(1),
        [`browsers.${browser}`]: increment(1),
        [`referrers.${referrer}`]: increment(1),
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      // Non-blocking background telemetry
    }
  },

  // ============================================================================
  // 3. AGGREGATED SUMMARY FOR ADMIN DASHBOARD (NO MOCK DATA)
  // ============================================================================
  getSummary(dateFilter: 'today' | '7d' | '30d' | 'all' = '7d'): AnalyticsSummary {
    const data = this.getStoredData();

    const todayStr = getTodayDateString();
    const todayStats = (data.dailyStats && data.dailyStats[todayStr]) || { visitors: 0, pageViews: 0, conversions: 0 };

    // Calculate time metrics from actual sessions
    const now = new Date();
    let visitorsWeek = 0;
    let visitorsMonth = 0;
    let visitorsYear = data.totalVisits || 0;

    Object.entries(data.dailyStats || {}).forEach(([dateStr, stat]: [string, any]) => {
      const d = new Date(dateStr);
      const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
      if (diffDays <= 7) visitorsWeek += (stat.visitors || 0);
      if (diffDays <= 30) visitorsMonth += (stat.visitors || 0);
    });

    // Top Pages
    const topPages = Object.entries(data.pageCounts || {})
      .map(([path, views]) => ({ path, label: path === '/' ? 'Homepage' : path, views: views as number }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);

    // Top Destinations
    const topDestinations = Object.entries(data.destinationCounts || {})
      .map(([name, views]) => ({ name, views: views as number }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);

    // Top Tours
    const topTours = Object.entries(data.tourCounts || {})
      .map(([name, views]) => ({ name, views: views as number }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Daily trends array
    const dailyTrends = Object.entries(data.dailyStats || {})
      .map(([date, stat]: [string, any]) => ({
        date,
        visitors: stat.visitors || 0,
        pageViews: stat.pageViews || 0,
        conversions: stat.conversions || 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);

    // Device breakdown with %
    const totalDevices = Object.values(data.deviceCounts || {}).reduce((a: any, b: any) => a + b, 0) as number || 0;
    const deviceBreakdown = Object.entries(data.deviceCounts || {}).map(([device, count]) => ({
      device,
      count: count as number,
      percentage: totalDevices > 0 ? Math.round(((count as number) / totalDevices) * 100) : 0
    }));

    // Browser breakdown
    const totalBrowsers = Object.values(data.browserCounts || {}).reduce((a: any, b: any) => a + b, 0) as number || 0;
    const browserBreakdown = Object.entries(data.browserCounts || {}).map(([browser, count]) => ({
      browser,
      count: count as number,
      percentage: totalBrowsers > 0 ? Math.round(((count as number) / totalBrowsers) * 100) : 0
    }));

    // Referral sources
    const referralSources = Object.entries(data.referrerCounts || {}).map(([source, count]) => ({
      source,
      count: count as number
    })).sort((a, b) => b.count - a.count);

    // Real inquiry & booking counts dynamically derived from storage
    const realInquiries = StorageService.getTripInquiries().length;
    const realBookings = StorageService.getTourBookings().length;
    const totalConversions = realInquiries + realBookings;

    // Conversion rate based strictly on real visitors and actual inquiries/bookings
    const totalVisits = data.totalVisits || 0;
    const conversionRate = totalVisits > 0 
      ? Math.round((totalConversions / totalVisits) * 1000) / 10 
      : 0;

    return {
      totalVisits: data.totalVisits || 0,
      uniqueVisitors: data.uniqueVisitors || 0,
      visitorsToday: todayStats.visitors || 0,
      visitorsThisWeek: visitorsWeek || todayStats.visitors || 0,
      visitorsThisMonth: visitorsMonth || visitorsWeek || 0,
      visitorsThisYear: visitorsYear || visitorsMonth || 0,
      pageViews: data.pageViews || 0,
      inquiryCount: realInquiries,
      bookingCount: realBookings,
      conversionRate,
      topPages,
      topDestinations,
      topTours,
      dailyTrends,
      deviceBreakdown,
      browserBreakdown,
      referralSources
    };
  }
};
