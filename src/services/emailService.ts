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
import emailjs from '@emailjs/browser';

const SETTINGS_KEY = 'mos_mos_business_settings_v1';
const NOTIFICATION_LOGS_KEY = 'mos_mos_notification_logs_v1';

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
  providerType: 'formsubmit'
};

export interface EmailDispatchResult {
  success: boolean;
  status: NotificationLog['status'];
  message: string;
}

// ============================================================================
// REAL HTTP DELIVERY PROVIDERS
// ============================================================================

// 1. FormSubmit Gateway (100% Free, zero-backend, direct to mailbox)
async function sendViaFormSubmit(
  recipient: string, 
  payload: EmailPayload, 
  type: string, 
  reference: string, 
  settings: BusinessSettings
): Promise<{ status: NotificationLog['status']; message: string }> {
  try {
    const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`;
    
    const body: Record<string, any> = {
      _subject: payload.subject,
      _template: 'table',
      _captcha: 'false',
      _replyto: payload.replyTo || (settings.supportEmail || 'gamechangerpos@gmail.com'),
      Reference: reference,
      NotificationType: type,
      Recipient: recipient,
      Message: payload.text
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success === 'true' || data.success === true) {
        return {
          status: 'DELIVERED',
          message: data.message || 'Delivered to mailbox successfully via FormSubmit.'
        };
      } else {
        const msg = data.message || 'Provider received request.';
        if (msg.toLowerCase().includes('activation') || msg.toLowerCase().includes('activate')) {
          return {
            status: 'SENT_TO_PROVIDER',
            message: 'Activation link sent by FormSubmit to recipient. Click "Activate Form" in inbox.'
          };
        }
        return {
          status: 'SENT_TO_PROVIDER',
          message: msg
        };
      }
    } else {
      const errText = await response.text();
      return {
        status: 'FAILED',
        message: `HTTP ${response.status}: ${errText.slice(0, 100)}`
      };
    }
  } catch (err: any) {
    return {
      status: 'FAILED',
      message: err?.message || 'Network error communicating with FormSubmit gateway.'
    };
  }
}

// 2. EmailJS Provider (Client-side custom template email sender)
async function sendViaEmailJS(
  recipient: string, 
  payload: EmailPayload, 
  reference: string, 
  settings: BusinessSettings
): Promise<{ status: NotificationLog['status']; message: string }> {
  if (!settings.emailJsServiceId || !settings.emailJsTemplateId || !settings.emailJsPublicKey) {
    return {
      status: 'FAILED',
      message: 'EmailJS credentials incomplete (Service ID, Template ID, or Public Key missing).'
    };
  }

  try {
    const res = await emailjs.send(
      settings.emailJsServiceId,
      settings.emailJsTemplateId,
      {
        to_email: recipient,
        to_name: recipient.split('@')[0],
        reply_to: payload.replyTo || (settings.supportEmail || 'gamechangerpos@gmail.com'),
        subject: payload.subject,
        message: payload.text,
        reference: reference
      },
      settings.emailJsPublicKey
    );

    if (res.status === 200) {
      return {
        status: 'DELIVERED',
        message: `Delivered via EmailJS (status: ${res.status})`
      };
    } else {
      return {
        status: 'FAILED',
        message: `EmailJS response: status ${res.status} ${res.text}`
      };
    }
  } catch (err: any) {
    return {
      status: 'FAILED',
      message: `EmailJS error: ${err?.text || err?.message || 'Unknown error'}`
    };
  }
}

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
  // 2. DISPATCH & LOGGING PIPELINE (REAL DELIVERY WITH AUDIT TRAIL)
  // ============================================================================
  async dispatchEmail(payload: EmailPayload, type: NotificationLog['type'], reference: string): Promise<EmailDispatchResult> {
    const logId = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const settings = await this.getSettings();
    let status: NotificationLog['status'] = 'QUEUED';
    let message = '';
    const providerName = settings.providerType || 'formsubmit';

    // 1. Execute Real HTTP Email Delivery
    if (settings.providerType === 'emailjs' && settings.emailJsServiceId && settings.emailJsPublicKey) {
      const res = await sendViaEmailJS(payload.to, payload, reference, settings);
      status = res.status;
      message = res.message;
    } else {
      // Default to FormSubmit gateway
      const res = await sendViaFormSubmit(payload.to, payload, type, reference, settings);
      status = res.status;
      message = res.message;
    }

    // 2. Queue in Cloud Firestore 'mail' collection (Firebase Trigger Email extension compatibility)
    try {
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
          queuedAt: new Date().toISOString(),
          provider: providerName,
          deliveryStatus: status
        },
        createdAt: serverTimestamp()
      });
    } catch (err) {
      // Non-blocking fallback
    }

    // 3. Create Audit Log Record
    const logEntry: NotificationLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      recipient: payload.to,
      subject: payload.subject,
      type,
      reference,
      status,
      errorMessage: status === 'FAILED' ? message : (status === 'SENT_TO_PROVIDER' ? message : undefined),
      provider: providerName
    };

    // Cache locally for instant UI update
    try {
      const cachedLogsStr = localStorage.getItem(NOTIFICATION_LOGS_KEY);
      const cachedLogs: NotificationLog[] = cachedLogsStr ? JSON.parse(cachedLogsStr) : [];
      cachedLogs.unshift(logEntry);
      localStorage.setItem(NOTIFICATION_LOGS_KEY, JSON.stringify(cachedLogs.slice(0, 100)));
    } catch {}

    // Persist in Firestore notificationLogs collection
    try {
      await addDoc(collection(db, 'notificationLogs'), {
        ...logEntry,
        serverTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn('[EmailService] Cloud audit log write:', err);
    }

    return {
      success: status === 'DELIVERED' || status === 'SENT_TO_PROVIDER',
      status,
      message
    };
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
    if (oldStatus === newStatus) return;

    const settings = await this.getSettings();
    if (!settings.statusNotificationsEnabled || !inquiry.customerEmail) return;

    const payload = EmailTemplates.statusUpdate(inquiry, oldStatus, newStatus, settings, adminMessage);
    await this.dispatchEmail(payload, 'status_update', inquiry.reference);
  },

  // ============================================================================
  // 6. TEST NOTIFICATION TRIGGER (For Administrators)
  // ============================================================================
  async sendTestEmail(targetEmail: string): Promise<EmailDispatchResult> {
    const settings = await this.getSettings();
    const payload = EmailTemplates.testEmail(settings, targetEmail);
    return await this.dispatchEmail(payload, 'test', `TEST-${Date.now()}`);
  },

  // ============================================================================
  // 7. FETCH AUDIT LOGS FOR ADMIN DASHBOARD
  // ============================================================================
  async getNotificationLogs(): Promise<NotificationLog[]> {
    const logsMap = new Map<string, NotificationLog>();

    // 1. Read local cache first (instant)
    try {
      const cachedLogsStr = localStorage.getItem(NOTIFICATION_LOGS_KEY);
      if (cachedLogsStr) {
        const cached: NotificationLog[] = JSON.parse(cachedLogsStr);
        cached.forEach(l => logsMap.set(l.id, l));
      }
    } catch {}

    // 2. Query Firestore notificationLogs collection
    try {
      const q = query(collection(db, 'notificationLogs'), orderBy('serverTimestamp', 'desc'), limit(50));
      const snap = await getDocs(q);
      snap.forEach(d => {
        const data = d.data() as NotificationLog;
        if (data.id) logsMap.set(data.id, data);
      });
    } catch (err) {
      console.warn('[EmailService] Error fetching remote notification logs:', err);
    }

    const logs = Array.from(logsMap.values());
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return logs;
  }
};
