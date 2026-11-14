import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BusinessSettings, NotificationLog, TripInquiry, TourBookingInquiry, InquiryStatus } from '../types';
import { EmailTemplates, EmailPayload } from './emailTemplates';

const SETTINGS_KEY = 'mos_mos_business_settings_v1';

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'MOS MOS Safaris',
  supportEmail: 'gamechangerpos@gmail.com',
  adminEmail: 'gamechangerpos@gmail.com',
  phone: '+256 700 123 456',
  address: 'Kampala & Entebbe, Uganda · Nairobi, Kenya',
  websiteUrl: typeof window !== 'undefined' ? window.location.origin : 'https://mosmossafaris.com',
  inquiryNotificationsEnabled: true,
  bookingNotificationsEnabled: true,
  statusNotificationsEnabled: true,
  customerConfirmationsEnabled: true,
  providerType: 'firestore_queue'
};

export const EmailService = {
  // ============================================================================
  // 1. BUSINESS & NOTIFICATION SETTINGS (Firestore + Local fallback)
  // ============================================================================
  async getSettings(): Promise<BusinessSettings> {
    try {
      const docRef = doc(db, 'businessSettings', 'general');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const remoteData = snap.data() as BusinessSettings;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(remoteData));
        return { ...DEFAULT_SETTINGS, ...remoteData };
      }
    } catch (err) {
      console.warn('[EmailService] Reading settings from local storage:', err);
    }

    try {
      const cached = localStorage.getItem(SETTINGS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}

    return DEFAULT_SETTINGS;
  },

  async updateSettings(updates: Partial<BusinessSettings>): Promise<boolean> {
    const current = await this.getSettings();
    const updated: BusinessSettings = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Save locally
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));

    // Save to Cloud Firestore
    try {
      const docRef = doc(db, 'businessSettings', 'general');
      await setDoc(docRef, updated, { merge: true });
      return true;
    } catch (err) {
      console.warn('[EmailService] Could not persist settings to Firestore:', err);
      return false;
    }
  },

  // ============================================================================
  // 2. DISPATCH & LOGGING PIPELINE
  // ============================================================================
  async dispatchEmail(payload: EmailPayload, type: NotificationLog['type'], reference: string): Promise<boolean> {
    const logId = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    let status: NotificationLog['status'] = 'QUEUED';
    let errorMessage: string | undefined = undefined;

    try {
      // 1. Push into Firestore 'mail' queue
      // This is the native standard for the Firebase "Trigger Email" extension (SendGrid/SMTP/Postmark)
      await addDoc(collection(db, 'mail'), {
        to: [payload.to],
        message: {
          subject: payload.subject,
          text: payload.text,
          html: payload.html
        },
        metadata: {
          type,
          reference,
          queuedAt: new Date().toISOString()
        },
        createdAt: serverTimestamp()
      });

      status = 'DELIVERED';
    } catch (err: any) {
      console.warn('[EmailService] Cloud queue dispatch fallback:', err);
      status = 'QUEUED';
      errorMessage = err?.message || 'Offline queue mode';
    }

    // 2. Audit in 'notificationLogs' collection
    const logEntry: NotificationLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      recipient: payload.to,
      subject: payload.subject,
      type,
      reference,
      status,
      errorMessage
    };

    try {
      await addDoc(collection(db, 'notificationLogs'), {
        ...logEntry,
        serverTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn('[EmailService] Could not write notification log:', err);
    }

    return status === 'DELIVERED';
  },

  // ============================================================================
  // 3. AUTOMATED INQUIRY TRIGGERS (Customer + Support)
  // ============================================================================
  async handleNewInquiry(inquiry: TripInquiry, customerId?: string): Promise<void> {
    const settings = await this.getSettings();

    // 1. Send Customer Confirmation Email (if enabled)
    if (settings.customerConfirmationsEnabled && inquiry.customerEmail) {
      const customerPayload = EmailTemplates.customerInquiry(inquiry, settings);
      await this.dispatchEmail(customerPayload, 'customer_inquiry', inquiry.reference);
    }

    // 2. Send Internal Support Team Notification (if enabled)
    if (settings.inquiryNotificationsEnabled && settings.supportEmail) {
      const supportPayload = EmailTemplates.supportInquiry(inquiry, settings, customerId);
      await this.dispatchEmail(supportPayload, 'support_inquiry', inquiry.reference);
    }
  },

  // ============================================================================
  // 4. AUTOMATED BOOKING TRIGGERS (Customer + Support)
  // ============================================================================
  async handleNewBooking(
    booking: TourBookingInquiry, 
    customerId?: string, 
    extra?: { destination?: string; experience?: string; duration?: string }
  ): Promise<void> {
    const settings = await this.getSettings();

    // 1. Customer Booking Receipt (Status: PENDING REVIEW)
    if (settings.customerConfirmationsEnabled && booking.customerEmail) {
      const customerPayload = EmailTemplates.customerBooking(booking, settings, extra);
      await this.dispatchEmail(customerPayload, 'customer_booking', booking.reference);
    }

    // 2. Support Booking Notification
    if (settings.bookingNotificationsEnabled && settings.supportEmail) {
      const supportPayload = EmailTemplates.supportBooking(booking, settings, customerId, extra);
      await this.dispatchEmail(supportPayload, 'support_booking', booking.reference);
    }
  },

  // ============================================================================
  // 5. BOOKING STATUS UPDATE TRIGGER
  // ============================================================================
  async handleStatusChange(
    inquiry: TripInquiry, 
    oldStatus: InquiryStatus, 
    newStatus: InquiryStatus, 
    adminMessage?: string
  ): Promise<void> {
    if (oldStatus === newStatus) return; // Prevent duplicate notifications

    const settings = await this.getSettings();
    if (!settings.statusNotificationsEnabled || !inquiry.customerEmail) return;

    const payload = EmailTemplates.statusUpdate(inquiry, oldStatus, newStatus, settings, adminMessage);
    await this.dispatchEmail(payload, 'status_update', inquiry.reference);
  },

  // ============================================================================
  // 6. TEST NOTIFICATION TRIGGER (For Administrators)
  // ============================================================================
  async sendTestEmail(targetEmail: string): Promise<boolean> {
    const settings = await this.getSettings();
    const payload = EmailTemplates.testEmail(settings, targetEmail);
    return await this.dispatchEmail(payload, 'test', `TEST-${Date.now()}`);
  },

  // ============================================================================
  // 7. FETCH AUDIT LOGS FOR ADMIN DASHBOARD
  // ============================================================================
  async getNotificationLogs(): Promise<NotificationLog[]> {
    const logs: NotificationLog[] = [];
    try {
      const q = query(collection(db, 'notificationLogs'), orderBy('serverTimestamp', 'desc'), limit(50));
      const snap = await getDocs(q);
      snap.forEach(d => logs.push(d.data() as NotificationLog));
    } catch (err) {
      console.warn('[EmailService] Error fetching notification logs:', err);
    }
    return logs;
  }
};
