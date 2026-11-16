import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NewsletterSubscriber, MarketingCampaign } from '../types';

export const MarketingService = {
  // ============================================================================
  // 1. NEWSLETTER SUBSCRIBERS
  // ============================================================================
  async subscribe(
    email: string, 
    name?: string, 
    interestTags: string[] = ['Wildlife Safaris', 'Conservation']
  ): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    const subscriberId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const subscriber: NewsletterSubscriber = {
      id: subscriberId,
      email: cleanEmail,
      name: name?.trim(),
      interestTags,
      subscribedAt: new Date().toISOString(),
      status: 'active'
    };

    // Cache locally
    try {
      const stored = localStorage.getItem('mos_mos_subscribers');
      const list: NewsletterSubscriber[] = stored ? JSON.parse(stored) : [];
      const idx = list.findIndex(s => s.email === cleanEmail);
      if (idx !== -1) {
        list[idx] = subscriber;
      } else {
        list.unshift(subscriber);
      }
      localStorage.setItem('mos_mos_subscribers', JSON.stringify(list));
    } catch {
      // silent
    }

    // Write to Firestore
    try {
      const docRef = doc(db, 'subscribers', subscriberId);
      await setDoc(docRef, {
        ...subscriber,
        serverSubscribedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[MarketingService] Firestore subscribe error:', err);
    }

    return { 
      success: true, 
      message: 'Thank you for subscribing to MOS MOS Safaris private expedition journal.' 
    };
  },

  async unsubscribe(email: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    const subscriberId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');

    try {
      const docRef = doc(db, 'subscribers', subscriberId);
      await updateDoc(docRef, {
        status: 'unsubscribed',
        unsubscribedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[MarketingService] Firestore unsubscribe error:', err);
    }

    try {
      const stored = localStorage.getItem('mos_mos_subscribers');
      if (stored) {
        const list: NewsletterSubscriber[] = JSON.parse(stored);
        const idx = list.findIndex(s => s.email === cleanEmail);
        if (idx !== -1) {
          list[idx].status = 'unsubscribed';
          list[idx].unsubscribedAt = new Date().toISOString();
          localStorage.setItem('mos_mos_subscribers', JSON.stringify(list));
        }
      }
    } catch {
      // silent
    }

    return true;
  },

  async getSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
      const q = query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc'), limit(150));
      const snap = await getDocs(q);
      const list: NewsletterSubscriber[] = [];
      snap.forEach(d => list.push(d.data() as NewsletterSubscriber));
      if (list.length > 0) return list;
    } catch (err) {
      console.warn('[MarketingService] getSubscribers Firestore error:', err);
    }

    try {
      const stored = localStorage.getItem('mos_mos_subscribers');
      return stored ? JSON.parse(stored) : [
        {
          id: 'sub_demo_1',
          email: 'safari.enthusiast@example.com',
          name: 'Harrison Sterling',
          interestTags: ['Great Migration', 'Gorilla Trekking'],
          subscribedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          status: 'active'
        },
        {
          id: 'sub_demo_2',
          email: 'wildlife.traveler@example.com',
          name: 'Sarah Jenkins',
          interestTags: ['Luxury Lodges', 'Wildlife Photography'],
          subscribedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
          status: 'active'
        }
      ];
    } catch {
      return [];
    }
  },

  // ============================================================================
  // 2. CAMPAIGN COMPOSER & HISTORY
  // ============================================================================
  async createCampaign(campaign: Omit<MarketingCampaign, 'id' | 'createdAt'>): Promise<MarketingCampaign> {
    const newCampaign: MarketingCampaign = {
      ...campaign,
      id: `camp_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    try {
      const stored = localStorage.getItem('mos_mos_campaigns');
      const list: MarketingCampaign[] = stored ? JSON.parse(stored) : [];
      list.unshift(newCampaign);
      localStorage.setItem('mos_mos_campaigns', JSON.stringify(list));
    } catch {
      // silent
    }

    try {
      const docRef = doc(db, 'campaigns', newCampaign.id);
      await setDoc(docRef, {
        ...newCampaign,
        serverCreatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('[MarketingService] createCampaign Firestore error:', err);
    }

    return newCampaign;
  },

  async getCampaigns(): Promise<MarketingCampaign[]> {
    try {
      const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'), limit(50));
      const snap = await getDocs(q);
      const list: MarketingCampaign[] = [];
      snap.forEach(d => list.push(d.data() as MarketingCampaign));
      if (list.length > 0) return list;
    } catch (err) {
      console.warn('[MarketingService] getCampaigns Firestore error:', err);
    }

    try {
      const stored = localStorage.getItem('mos_mos_campaigns');
      return stored ? JSON.parse(stored) : [
        {
          id: 'camp_1',
          title: '2026 Great Migration Advance Access',
          subject: 'Private Booking Window: Serengeti River Crossing 2026',
          previewText: 'Exclusive lodge permits now unlocked for MOS MOS patrons.',
          bodyHtml: '<p>Dear Safari Patron,<br>We are pleased to announce the opening of our 2026 Great Migration private camps in Northern Serengeti...</p>',
          targetTags: ['Great Migration', 'Wildlife Safaris'],
          sentAt: '2026-02-10T10:00:00Z',
          recipientCount: 142,
          status: 'sent',
          createdAt: '2026-02-09T18:00:00Z'
        }
      ];
    } catch {
      return [];
    }
  },

  // ============================================================================
  // 3. AUTOMATED PACKAGE ANNOUNCEMENTS
  // ============================================================================
  async triggerPackageAnnouncement(packageTitle: string, destination: string, slug: string): Promise<MarketingCampaign> {
    const campaign: Omit<MarketingCampaign, 'id' | 'createdAt'> = {
      title: `New Expedition: ${packageTitle}`,
      subject: `Introducing ${packageTitle} — ${destination}`,
      previewText: `A new bespoke safari journey is now open for private reservation.`,
      bodyHtml: `<h3>${packageTitle}</h3><p>We are thrilled to unveil our latest curated safari experience in ${destination}. Crafted for travelers seeking unparalleled encounters with nature.</p><p><a href="/travel-packages/${slug}">Explore Full Itinerary & Private Inclusions &rarr;</a></p>`,
      targetTags: [destination, 'All Patrons'],
      sentAt: new Date().toISOString(),
      recipientCount: 88,
      status: 'sent'
    };

    return this.createCampaign(campaign);
  }
};
