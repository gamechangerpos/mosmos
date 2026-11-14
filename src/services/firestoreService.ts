import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TripInquiry, FlightInquiry, TourBookingInquiry, InquiryStatus } from '../types';

export interface CustomerProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export const FirestoreService = {
  // ============================================================================
  // 1. CUSTOMER PROFILES
  // ============================================================================
  async createOrUpdateCustomer(profile: { uid: string; email: string; displayName?: string; photoURL?: string; phoneNumber?: string }): Promise<void> {
    try {
      const userRef = doc(db, 'customers', profile.uid);
      const existing = await getDoc(userRef);
      
      const payload: Record<string, any> = {
        uid: profile.uid,
        email: profile.email,
        lastLoginAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      };

      if (profile.displayName) payload.displayName = profile.displayName;
      if (profile.photoURL) payload.photoURL = profile.photoURL;
      if (profile.phoneNumber) payload.phoneNumber = profile.phoneNumber;

      if (!existing.exists()) {
        payload.createdAt = new Date().toISOString();
      }

      await setDoc(userRef, payload, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Could not sync customer profile:', err);
    }
  },

  async getCustomer(uid: string): Promise<CustomerProfile | null> {
    try {
      const userRef = doc(db, 'customers', uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        return snapshot.data() as CustomerProfile;
      }
      return null;
    } catch (err) {
      console.warn('[Firestore] Error getting customer profile:', err);
      return null;
    }
  },

  // ============================================================================
  // 2. ADMINISTRATOR VERIFICATION
  // ============================================================================
  async checkIsAdmin(uid: string, email?: string): Promise<boolean> {
    try {
      // 1. Check if email matches designated administrator accounts
      const adminEnv = import.meta.env.VITE_ADMIN_EMAILS || '';
      const allowedEmails = adminEnv
        .split(',')
        .map((e: string) => e.trim().toLowerCase())
        .filter(Boolean);

      if (email && allowedEmails.includes(email.toLowerCase())) {
        return true;
      }

      // 2. Check admins collection in Firestore
      const adminRef = doc(db, 'admins', uid);
      const snapshot = await getDoc(adminRef);
      if (snapshot.exists()) {
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[Firestore] Admin check error:', err);
      return false;
    }
  },

  // ============================================================================
  // 3. TRIP INQUIRIES
  // ============================================================================
  async saveTripInquiry(
    inquiry: Omit<TripInquiry, 'id' | 'reference' | 'createdAt' | 'status'>,
    customerId?: string
  ): Promise<TripInquiry> {
    const reference = `MMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInquiry: TripInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      reference,
      createdAt: new Date().toISOString(),
      status: 'Inquiry received',
      statusNotes: 'Your inquiry has been successfully received by MOS MOS Safaris expedition directors. An experienced regional specialist will prepare your custom proposal within 24 hours.'
    };

    try {
      const docRef = doc(db, 'inquiries', reference);
      await setDoc(docRef, {
        ...newInquiry,
        customerId: customerId || null,
        serverCreatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('[Firestore] Offline or failed to write inquiry to Firestore:', err);
    }

    return newInquiry;
  },

  async findInquiryByReference(reference: string): Promise<TripInquiry | null> {
    try {
      const cleanRef = reference.trim().toUpperCase();
      const docRef = doc(db, 'inquiries', cleanRef);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        return snapshot.data() as TripInquiry;
      }
    } catch (err) {
      console.warn('[Firestore] Error finding inquiry by ref:', err);
    }
    return null;
  },

  async getInquiriesByCustomer(customerId?: string, email?: string): Promise<TripInquiry[]> {
    const results: TripInquiry[] = [];
    try {
      if (customerId) {
        const q = query(collection(db, 'inquiries'), where('customerId', '==', customerId));
        const snap = await getDocs(q);
        snap.forEach(d => results.push(d.data() as TripInquiry));
      } else if (email) {
        const q = query(collection(db, 'inquiries'), where('customerEmail', '==', email.toLowerCase()));
        const snap = await getDocs(q);
        snap.forEach(d => results.push(d.data() as TripInquiry));
      }
    } catch (err) {
      console.warn('[Firestore] Error fetching customer inquiries:', err);
    }
    return results;
  },

  async getAllInquiries(): Promise<TripInquiry[]> {
    const list: TripInquiry[] = [];
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      snap.forEach(d => list.push(d.data() as TripInquiry));
    } catch (err) {
      console.warn('[Firestore] Error fetching all inquiries:', err);
    }
    return list;
  },

  async updateTripInquiryStatus(
    reference: string, 
    status: InquiryStatus, 
    statusNotes?: string, 
    adminNote?: string, 
    quotedAmount?: number
  ): Promise<boolean> {
    try {
      const docRef = doc(db, 'inquiries', reference);
      const updateData: Record<string, any> = { status };
      
      if (statusNotes !== undefined) updateData.statusNotes = statusNotes;
      if (quotedAmount !== undefined) updateData.quotedAmount = quotedAmount;
      if (adminNote) {
        updateData.adminNotes = arrayUnion(`${new Date().toLocaleDateString()}: ${adminNote}`);
      }

      await updateDoc(docRef, updateData);
      return true;
    } catch (err) {
      console.warn('[Firestore] Error updating inquiry status:', err);
      return false;
    }
  },

  // ============================================================================
  // 4. TOUR BOOKINGS
  // ============================================================================
  async saveTourBooking(
    booking: Omit<TourBookingInquiry, 'id' | 'reference' | 'createdAt' | 'status'>,
    customerId?: string
  ): Promise<TourBookingInquiry> {
    const reference = `TUR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: TourBookingInquiry = {
      ...booking,
      id: `tur-${Date.now()}`,
      reference,
      createdAt: new Date().toISOString(),
      status: 'Inquiry received'
    };

    try {
      const docRef = doc(db, 'bookings', reference);
      await setDoc(docRef, {
        ...newRecord,
        customerId: customerId || null,
        serverCreatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('[Firestore] Error saving tour booking:', err);
    }

    return newRecord;
  },

  // ============================================================================
  // 5. FLIGHT INQUIRIES
  // ============================================================================
  async saveFlightInquiry(
    inquiry: Omit<FlightInquiry, 'id' | 'reference' | 'createdAt' | 'status'>,
    customerId?: string
  ): Promise<FlightInquiry> {
    const reference = `FLT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: FlightInquiry = {
      ...inquiry,
      id: `flt-${Date.now()}`,
      reference,
      createdAt: new Date().toISOString(),
      status: 'Inquiry received'
    };

    try {
      const docRef = doc(db, 'inquiries', reference);
      await setDoc(docRef, {
        ...newRecord,
        type: 'flight',
        customerId: customerId || null,
        serverCreatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('[Firestore] Error saving flight inquiry:', err);
    }

    return newRecord;
  },

  // ============================================================================
  // 6. CONTACT MESSAGES
  // ============================================================================
  async saveContactMessage(message: { name: string; email: string; phone?: string; subject?: string; message: string }): Promise<string> {
    const id = `msg-${Date.now()}`;
    try {
      const docRef = doc(db, 'contactMessages', id);
      await setDoc(docRef, {
        id,
        ...message,
        createdAt: new Date().toISOString(),
        status: 'unread',
        serverCreatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('[Firestore] Error saving contact message:', err);
    }
    return id;
  },

  // ============================================================================
  // 7. NEWSLETTER SUBSCRIPTION
  // ============================================================================
  async subscribeNewsletter(email: string): Promise<boolean> {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const docRef = doc(db, 'newsletter', cleanEmail);
      await setDoc(docRef, {
        email: cleanEmail,
        subscribedAt: new Date().toISOString(),
        serverCreatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn('[Firestore] Error subscribing newsletter:', err);
      return false;
    }
  }
};
