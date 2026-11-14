import { TripInquiry, FlightInquiry, TourBookingInquiry, InquiryStatus } from '../types';
import { FirestoreService } from './firestoreService';
import { EmailService } from './emailService';

const TRIP_INQUIRIES_KEY = 'omoja_trip_inquiries_v1';
const FLIGHT_INQUIRIES_KEY = 'omoja_flight_inquiries_v1';
const TOUR_BOOKINGS_KEY = 'omoja_tour_bookings_v1';

export const StorageService = {
  getTripInquiries(): TripInquiry[] {
    try {
      const stored = localStorage.getItem(TRIP_INQUIRIES_KEY);
      if (!stored) {
        return [];
      }
      const list: TripInquiry[] = JSON.parse(stored);
      // Remove any legacy mock seed inquiries from previous demo sessions
      const cleanList = list.filter(inq => 
        !['inq-001', 'inq-002', 'inq-003'].includes(inq.id) &&
        !['elena.rostova@example.com', 'marcus.t@adventures.net', 'sarah.jenkins@oxford.ac.uk'].includes(inq.customerEmail)
      );
      if (cleanList.length !== list.length) {
        localStorage.setItem(TRIP_INQUIRIES_KEY, JSON.stringify(cleanList));
      }
      return cleanList;
    } catch {
      return [];
    }
  },

  async syncWithFirestore(): Promise<TripInquiry[]> {
    try {
      const remoteInquiries = await FirestoreService.getAllInquiries();
      if (remoteInquiries && remoteInquiries.length > 0) {
        // Filter out any mock inquiries from remote if any were pushed
        const cleanRemote = remoteInquiries.filter(inq =>
          !['inq-001', 'inq-002', 'inq-003'].includes(inq.id) &&
          !['elena.rostova@example.com', 'marcus.t@adventures.net', 'sarah.jenkins@oxford.ac.uk'].includes(inq.customerEmail)
        );
        const local = this.getTripInquiries();
        const refMap = new Map<string, TripInquiry>();
        cleanRemote.forEach(i => refMap.set(i.reference, i));
        local.forEach(i => {
          if (!refMap.has(i.reference)) {
            refMap.set(i.reference, i);
          }
        });
        const merged = Array.from(refMap.values());
        localStorage.setItem(TRIP_INQUIRIES_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      console.warn('[StorageService] Firestore sync fallback to local cache:', err);
    }
    return this.getTripInquiries();
  },

  saveTripInquiry(inquiry: Omit<TripInquiry, 'id' | 'reference' | 'createdAt' | 'status'>, customerId?: string): TripInquiry {
    const inquiries = this.getTripInquiries();
    const reference = `MMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInquiry: TripInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      reference,
      createdAt: new Date().toISOString(),
      status: 'Inquiry received',
      statusNotes: 'Your inquiry has been successfully received by MOS MOS Safaris expedition directors. An experienced regional specialist will prepare your custom proposal within 24 hours.'
    };

    inquiries.unshift(newInquiry);
    localStorage.setItem(TRIP_INQUIRIES_KEY, JSON.stringify(inquiries));

    // Async sync to Cloud Firestore
    FirestoreService.saveTripInquiry(inquiry, customerId).catch((err) => {
      console.warn('[StorageService] Cloud sync error:', err);
    });

    // Automated Dual Email Notification (Customer confirmation + Support team alert)
    EmailService.handleNewInquiry(newInquiry, customerId).catch((err) => {
      console.warn('[StorageService] Email notification dispatch error:', err);
    });

    return newInquiry;
  },

  updateTripInquiryStatus(reference: string, status: InquiryStatus, statusNotes?: string, adminNote?: string, quotedAmount?: number): boolean {
    const inquiries = this.getTripInquiries();
    const index = inquiries.findIndex(i => i.reference === reference);
    if (index === -1) return false;

    const oldStatus = inquiries[index].status;
    inquiries[index].status = status;
    if (statusNotes) inquiries[index].statusNotes = statusNotes;
    if (quotedAmount !== undefined) inquiries[index].quotedAmount = quotedAmount;
    if (adminNote) {
      if (!inquiries[index].adminNotes) inquiries[index].adminNotes = [];
      inquiries[index].adminNotes!.push(`${new Date().toLocaleDateString()}: ${adminNote}`);
    }

    localStorage.setItem(TRIP_INQUIRIES_KEY, JSON.stringify(inquiries));

    // Async sync to Cloud Firestore
    FirestoreService.updateTripInquiryStatus(reference, status, statusNotes, adminNote, quotedAmount).catch((err) => {
      console.warn('[StorageService] Cloud sync update error:', err);
    });

    // Automated Status Change Email Notification to Customer
    if (oldStatus !== status) {
      EmailService.handleStatusChange(inquiries[index], oldStatus, status, adminNote || statusNotes).catch((err) => {
        console.warn('[StorageService] Status update email error:', err);
      });
    }

    return true;
  },

  findInquiryByReference(reference: string): TripInquiry | null {
    const cleanRef = reference.trim().toUpperCase();
    const inquiries = this.getTripInquiries();
    return inquiries.find(i => i.reference.toUpperCase() === cleanRef) || null;
  },

  // Flight inquiries
  getFlightInquiries(): FlightInquiry[] {
    try {
      const stored = localStorage.getItem(FLIGHT_INQUIRIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveFlightInquiry(inquiry: Omit<FlightInquiry, 'id' | 'reference' | 'createdAt' | 'status'>, customerId?: string): FlightInquiry {
    const list = this.getFlightInquiries();
    const reference = `FLT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: FlightInquiry = {
      ...inquiry,
      id: `flt-${Date.now()}`,
      reference,
      createdAt: new Date().toISOString(),
      status: 'Inquiry received'
    };
    list.unshift(newRecord);
    localStorage.setItem(FLIGHT_INQUIRIES_KEY, JSON.stringify(list));

    // Sync to Cloud Firestore
    FirestoreService.saveFlightInquiry(inquiry, customerId).catch((err) => {
      console.warn('[StorageService] Cloud sync error:', err);
    });

    return newRecord;
  },

  // Tour booking inquiries
  getTourBookings(): TourBookingInquiry[] {
    try {
      const stored = localStorage.getItem(TOUR_BOOKINGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveTourBooking(inquiry: Omit<TourBookingInquiry, 'id' | 'reference' | 'createdAt' | 'status'>, customerId?: string): TourBookingInquiry {
    const list = this.getTourBookings();
    const reference = `TUR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: TourBookingInquiry = {
      ...inquiry,
      id: `tur-${Date.now()}`,
      reference,
      createdAt: new Date().toISOString(),
      status: 'Inquiry received'
    };
    list.unshift(newRecord);
    localStorage.setItem(TOUR_BOOKINGS_KEY, JSON.stringify(list));

    // Sync to Cloud Firestore
    FirestoreService.saveTourBooking(inquiry, customerId).catch((err) => {
      console.warn('[StorageService] Cloud sync error:', err);
    });

    // Automated Dual Email Notification for Tour Booking (Customer Receipt + Support Alert)
    EmailService.handleNewBooking(newRecord, customerId).catch((err) => {
      console.warn('[StorageService] Booking email notification error:', err);
    });

    return newRecord;
  }
};
