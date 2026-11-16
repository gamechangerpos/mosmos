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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  JourneyStage, 
  TripInquiry, 
  CustomerPreferences, 
  SupportConversation, 
  SupportMessage, 
  WishlistItem, 
  TravelMemory, 
  LoyaltyProfile, 
  LoyaltyTier, 
  GroupTrip, 
  TravelDocument,
  StageUpdateLog 
} from '../types';

export const JOURNEY_STAGES: { stage: JourneyStage; order: number; label: string; description: string }[] = [
  { stage: 'Inquiry received', order: 1, label: 'Inquiry Received', description: 'Your expedition request has been securely registered in our safari directory.' },
  { stage: 'Inquiry under review', order: 2, label: 'Under Review', description: 'Our senior destination director is reviewing park routes, permits, and seasonal movements.' },
  { stage: 'Travel planning', order: 3, label: 'Travel Planning', description: 'Customizing lodge availability, private 4x4 land cruisers, and aviation transfers.' },
  { stage: 'Proposal sent', order: 4, label: 'Proposal Sent', description: 'A tailored bespoke itinerary proposal has been delivered to your portal and inbox.' },
  { stage: 'Awaiting customer decision', order: 5, label: 'Awaiting Decision', description: 'Awaiting your review and confirmation of dates, routes, and special requests.' },
  { stage: 'Booking confirmed', order: 6, label: 'Booking Confirmed', description: 'Permits and private luxury camps are officially reserved and locked.' },
  { stage: 'Travel preparation', order: 7, label: 'Travel Preparation', description: 'Pre-safari briefing, health & visa checklist, and packing guidelines finalized.' },
  { stage: 'Trip in progress', order: 8, label: 'Trip in Progress', description: 'You are currently experiencing the untamed African savanna under private escort.' },
  { stage: 'Trip completed', order: 9, label: 'Trip Completed', description: 'Journey concluded with timeless memories, conservation support, and lifetime memories.' },
  { stage: 'Cancelled', order: 10, label: 'Cancelled', description: 'Expedition cancelled or deferred to a future season upon request.' }
];

export const PortalService = {
  // ============================================================================
  // 1. JOURNEY & BOOKING MANAGEMENT
  // ============================================================================
  async updateJourneyStage(
    reference: string,
    newStage: JourneyStage,
    notes?: string,
    consultant?: TripInquiry['assignedConsultant']
  ): Promise<boolean> {
    try {
      const docRef = doc(db, 'inquiries', reference.toUpperCase());
      const updateData: Record<string, any> = {
        journeyStage: newStage,
        statusNotes: notes || `Expedition stage transitioned to ${newStage}.`,
        updatedAt: serverTimestamp()
      };

      if (consultant) {
        updateData.assignedConsultant = consultant;
      }

      const logEntry: StageUpdateLog = {
        stage: newStage,
        timestamp: new Date().toISOString(),
        notes: notes || `Stage updated to ${newStage}`
      };
      updateData.journeyUpdates = arrayUnion(logEntry);

      await updateDoc(docRef, updateData);
      return true;
    } catch (err) {
      console.warn('[PortalService] updateJourneyStage Firestore error, falling back locally:', err);
      // Fallback in localStorage
      try {
        const stored = localStorage.getItem('mos_mos_trip_inquiries');
        if (stored) {
          const list: TripInquiry[] = JSON.parse(stored);
          const idx = list.findIndex(i => i.reference.toUpperCase() === reference.toUpperCase());
          if (idx !== -1) {
            list[idx].journeyStage = newStage;
            if (notes) list[idx].statusNotes = notes;
            if (consultant) list[idx].assignedConsultant = consultant;
            list[idx].journeyUpdates = list[idx].journeyUpdates || [];
            list[idx].journeyUpdates?.push({
              stage: newStage,
              timestamp: new Date().toISOString(),
              notes
            });
            localStorage.setItem('mos_mos_trip_inquiries', JSON.stringify(list));
            return true;
          }
        }
      } catch {
        // silent
      }
      return false;
    }
  },

  async addTravelDocument(reference: string, documentItem: TravelDocument): Promise<boolean> {
    try {
      const docRef = doc(db, 'inquiries', reference.toUpperCase());
      await updateDoc(docRef, {
        documents: arrayUnion(documentItem),
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.warn('[PortalService] addTravelDocument Firestore error:', err);
      return false;
    }
  },

  // ============================================================================
  // 2. CUSTOMER TRAVEL PREFERENCES & PROFILE
  // ============================================================================
  async getCustomerPreferences(customerId: string): Promise<CustomerPreferences | null> {
    const storageKey = `mos_mos_prefs_${customerId}`;
    try {
      const docRef = doc(db, 'customer_preferences', customerId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as CustomerPreferences;
        localStorage.setItem(storageKey, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('[PortalService] getCustomerPreferences Firestore error:', err);
    }

    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) return JSON.parse(cached);
    } catch {
      // silent
    }

    return null;
  },

  async saveCustomerPreferences(customerId: string, prefs: CustomerPreferences): Promise<boolean> {
    const storageKey = `mos_mos_prefs_${customerId}`;
    const payload = {
      ...prefs,
      updatedAt: new Date().toISOString()
    };

    // Cache locally immediately
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // silent
    }

    try {
      const docRef = doc(db, 'customer_preferences', customerId);
      await setDoc(docRef, {
        ...payload,
        serverUpdatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn('[PortalService] saveCustomerPreferences Firestore error:', err);
      return true; // LocalStorage succeeded
    }
  },

  // ============================================================================
  // 3. PRIVATE SUPPORT MESSAGING
  // ============================================================================
  async getOrCreateConversation(
    customerId: string, 
    customerName: string, 
    customerEmail: string, 
    subject: string = 'Safari Expedition Planning'
  ): Promise<SupportConversation> {
    const convId = `conv_${customerId}`;
    const storageKey = `mos_mos_conv_${convId}`;

    const defaultConv: SupportConversation = {
      id: convId,
      customerId,
      customerName,
      customerEmail,
      subject,
      status: 'open',
      lastMessageAt: new Date().toISOString(),
      lastMessageSnippet: 'Conversation initiated with MOS MOS Safaris Concierge.',
      unreadForAdminCount: 0,
      unreadForCustomerCount: 0
    };

    try {
      const docRef = doc(db, 'conversations', convId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as SupportConversation;
      } else {
        await setDoc(docRef, {
          ...defaultConv,
          createdAt: serverTimestamp()
        });
        return defaultConv;
      }
    } catch (err) {
      console.warn('[PortalService] getOrCreateConversation error, using local fallback:', err);
      const cached = localStorage.getItem(storageKey);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(storageKey, JSON.stringify(defaultConv));
      return defaultConv;
    }
  },

  async getMessages(conversationId: string): Promise<SupportMessage[]> {
    const storageKey = `mos_mos_msgs_${conversationId}`;
    try {
      const q = query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('createdAt', 'asc'),
        limit(100)
      );
      const snap = await getDocs(q);
      const list: SupportMessage[] = [];
      snap.forEach(d => list.push(d.data() as SupportMessage));
      if (list.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.warn('[PortalService] getMessages Firestore error, checking local:', err);
    }

    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) return JSON.parse(cached);
    } catch {
      // silent
    }

    return [];
  },

  async sendMessage(
    conversationId: string, 
    msg: Omit<SupportMessage, 'id' | 'createdAt' | 'read'>
  ): Promise<SupportMessage> {
    const newMsg: SupportMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      read: false
    };

    const storageKey = `mos_mos_msgs_${conversationId}`;
    try {
      const cached = localStorage.getItem(storageKey);
      const list: SupportMessage[] = cached ? JSON.parse(cached) : [];
      list.push(newMsg);
      localStorage.setItem(storageKey, JSON.stringify(list));
    } catch {
      // silent
    }

    try {
      const msgRef = doc(db, 'conversations', conversationId, 'messages', newMsg.id);
      await setDoc(msgRef, {
        ...newMsg,
        serverCreatedAt: serverTimestamp()
      });

      const convRef = doc(db, 'conversations', conversationId);
      await updateDoc(convRef, {
        lastMessageAt: newMsg.createdAt,
        lastMessageSnippet: newMsg.message.slice(0, 100),
        status: newMsg.senderRole === 'customer' ? 'pending_admin' : 'open',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('[PortalService] sendMessage Firestore write error:', err);
    }

    return newMsg;
  },

  async getAllAdminConversations(): Promise<SupportConversation[]> {
    try {
      const q = query(collection(db, 'conversations'), orderBy('lastMessageAt', 'desc'), limit(50));
      const snap = await getDocs(q);
      const list: SupportConversation[] = [];
      snap.forEach(d => list.push(d.data() as SupportConversation));
      return list;
    } catch (err) {
      console.warn('[PortalService] getAllAdminConversations error:', err);
      return [];
    }
  },

  // ============================================================================
  // 4. WISHLIST / SAVED EXPERIENCES
  // ============================================================================
  async getWishlist(customerId: string): Promise<WishlistItem[]> {
    const storageKey = `mos_mos_wishlist_${customerId}`;
    try {
      const q = query(collection(db, 'customers', customerId, 'wishlist'), orderBy('addedAt', 'desc'));
      const snap = await getDocs(q);
      const list: WishlistItem[] = [];
      snap.forEach(d => list.push(d.data() as WishlistItem));
      if (list.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.warn('[PortalService] getWishlist error:', err);
    }

    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) return JSON.parse(cached);
    } catch {
      // silent
    }

    return [];
  },

  async toggleWishlistItem(customerId: string, item: Omit<WishlistItem, 'id' | 'addedAt'>): Promise<boolean> {
    const storageKey = `mos_mos_wishlist_${customerId}`;
    let items: WishlistItem[] = [];
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) items = JSON.parse(cached);
    } catch {
      items = [];
    }

    const existingIndex = items.findIndex(i => i.itemId === item.itemId);
    const isAdding = existingIndex === -1;

    if (isAdding) {
      const newItem: WishlistItem = {
        ...item,
        id: `wish_${Date.now()}`,
        addedAt: new Date().toISOString()
      };
      items.unshift(newItem);

      try {
        const itemRef = doc(db, 'customers', customerId, 'wishlist', item.itemId);
        await setDoc(itemRef, newItem);
      } catch (err) {
        console.warn('[PortalService] toggleWishlist add firestore error:', err);
      }
    } else {
      items.splice(existingIndex, 1);
      try {
        const itemRef = doc(db, 'customers', customerId, 'wishlist', item.itemId);
        await setDoc(itemRef, { deleted: true });
      } catch (err) {
        console.warn('[PortalService] toggleWishlist remove firestore error:', err);
      }
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // silent
    }

    return isAdding;
  },

  // ============================================================================
  // 5. TRAVEL MEMORIES
  // ============================================================================
  async getTravelMemories(customerId: string): Promise<TravelMemory[]> {
    const storageKey = `mos_mos_memories_${customerId}`;
    try {
      const q = query(collection(db, 'customers', customerId, 'memories'), orderBy('year', 'desc'));
      const snap = await getDocs(q);
      const list: TravelMemory[] = [];
      snap.forEach(d => list.push(d.data() as TravelMemory));
      if (list.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.warn('[PortalService] getTravelMemories error:', err);
    }

    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) return JSON.parse(cached);
    } catch {
      // silent
    }

    return [];
  },

  async addTravelMemory(customerId: string, memory: Omit<TravelMemory, 'id' | 'createdAt'>): Promise<TravelMemory> {
    const storageKey = `mos_mos_memories_${customerId}`;
    const newMemory: TravelMemory = {
      ...memory,
      id: `mem_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    try {
      const cached = localStorage.getItem(storageKey);
      const list: TravelMemory[] = cached ? JSON.parse(cached) : [];
      list.unshift(newMemory);
      localStorage.setItem(storageKey, JSON.stringify(list));
    } catch {
      // silent
    }

    try {
      const memRef = doc(db, 'customers', customerId, 'memories', newMemory.id);
      await setDoc(memRef, newMemory);
    } catch (err) {
      console.warn('[PortalService] addTravelMemory firestore write error:', err);
    }

    return newMemory;
  },

  // ============================================================================
  // 6. LOYALTY & RETURNING CUSTOMER SYSTEM
  // ============================================================================
  calculateTier(completedTrips: number, points: number): LoyaltyTier {
    if (completedTrips >= 5 || points >= 15000) return 'Elite';
    if (completedTrips >= 3 || points >= 8000) return 'Gold';
    if (completedTrips >= 1 || points >= 2500) return 'Silver';
    return 'Bronze';
  },

  async getLoyaltyProfile(customerId: string, customerEmail?: string): Promise<LoyaltyProfile> {
    const storageKey = `mos_mos_loyalty_${customerId}`;
    const defaultProfile: LoyaltyProfile = {
      customerId,
      tier: 'Bronze',
      points: 500, // Welcome points
      completedTripsCount: 0,
      referralCode: `MOS-${customerId.substring(0, 5).toUpperCase()}`,
      referralsCount: 0,
      referralRewardsEarned: 0,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = doc(db, 'customers', customerId, 'meta', 'loyalty');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as LoyaltyProfile;
        localStorage.setItem(storageKey, JSON.stringify(data));
        return data;
      } else {
        await setDoc(docRef, defaultProfile);
        localStorage.setItem(storageKey, JSON.stringify(defaultProfile));
        return defaultProfile;
      }
    } catch (err) {
      console.warn('[PortalService] getLoyaltyProfile error, checking cache:', err);
    }

    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) return JSON.parse(cached);
    } catch {
      // silent
    }

    return defaultProfile;
  },

  // ============================================================================
  // 7. GROUP TRAVEL SAFARIS
  // ============================================================================
  async getGroupTrips(customerId: string): Promise<GroupTrip[]> {
    const storageKey = `mos_mos_groups_${customerId}`;
    try {
      const q = query(collection(db, 'group_trips'), where('creatorId', '==', customerId));
      const snap = await getDocs(q);
      const list: GroupTrip[] = [];
      snap.forEach(d => list.push(d.data() as GroupTrip));
      if (list.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.warn('[PortalService] getGroupTrips error:', err);
    }

    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) return JSON.parse(cached);
    } catch {
      // silent
    }

    return [];
  },

  async createGroupTrip(customerId: string, creatorName: string, trip: {
    tripTitle: string;
    destination: string;
    travelDates: string;
    groupNotes?: string;
  }): Promise<GroupTrip> {
    const storageKey = `mos_mos_groups_${customerId}`;
    const newTrip: GroupTrip = {
      id: `grp_${Date.now()}`,
      creatorId: customerId,
      creatorName,
      tripTitle: trip.tripTitle,
      destination: trip.destination,
      travelDates: trip.travelDates,
      groupNotes: trip.groupNotes,
      invitations: [],
      createdAt: new Date().toISOString()
    };

    try {
      const cached = localStorage.getItem(storageKey);
      const list: GroupTrip[] = cached ? JSON.parse(cached) : [];
      list.unshift(newTrip);
      localStorage.setItem(storageKey, JSON.stringify(list));
    } catch {
      // silent
    }

    try {
      const docRef = doc(db, 'group_trips', newTrip.id);
      await setDoc(docRef, {
        ...newTrip,
        serverCreatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('[PortalService] createGroupTrip firestore write error:', err);
    }

    return newTrip;
  },

  async inviteToGroupTrip(tripId: string, email: string): Promise<boolean> {
    try {
      const tripRef = doc(db, 'group_trips', tripId);
      await updateDoc(tripRef, {
        invitations: arrayUnion({
          email: email.trim().toLowerCase(),
          invitedAt: new Date().toISOString(),
          status: 'invited'
        })
      });
      return true;
    } catch (err) {
      console.warn('[PortalService] inviteToGroupTrip error:', err);
      return false;
    }
  }
};
