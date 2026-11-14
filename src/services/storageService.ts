import { TripInquiry, FlightInquiry, TourBookingInquiry, InquiryStatus } from '../types';
import { FirestoreService } from './firestoreService';

const TRIP_INQUIRIES_KEY = 'omoja_trip_inquiries_v1';
const FLIGHT_INQUIRIES_KEY = 'omoja_flight_inquiries_v1';
const TOUR_BOOKINGS_KEY = 'omoja_tour_bookings_v1';

// Seed sample initial records for realistic tracking
const INITIAL_TRIP_INQUIRIES: TripInquiry[] = [
  {
    id: 'inq-001',
    reference: 'MMS-2026-7841',
    createdAt: '2026-10-24T14:30:00Z',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@example.com',
    customerPhone: '+44 7911 123456',
    preferredContact: 'email',
    destinations: ['Uganda', 'Rwanda'],
    travelDates: '2027-02-10 to 2027-02-22',
    durationDays: 12,
    adultsCount: 2,
    childrenCount: 0,
    budgetRange: '$4,000 - $6,000 per person',
    travelStyle: 'Luxury Safari & Eco-Lodges',
    preferredExperiences: ['Mountain Gorilla Trekking', 'Chimpanzee Habituation', 'Canopy Walkway'],
    accommodationType: 'Luxury Tented Camp & Boutique Eco-Lodge',
    notes: 'Interested in premier lodges like Bisate Lodge and Sanctuary Forest Camp. Photography is high priority.',
    status: 'Quotation prepared',
    statusNotes: 'Detailed itinerary prepared with confirmed gorilla permits allocation at UWA & RDB. Awaiting customer review.',
    quotedAmount: 11200,
    adminNotes: ['Gorilla permits provisionally blocked with UWA', 'Client requested vegetarian dining option']
  },
  {
    id: 'inq-002',
    reference: 'MMS-2026-8912',
    createdAt: '2026-10-25T09:15:00Z',
    customerName: 'Marcus Thorne',
    customerEmail: 'marcus.t@adventures.net',
    customerPhone: '+1 (415) 555-0199',
    preferredContact: 'whatsapp',
    destinations: ['Tanzania'],
    travelDates: '2027-07-15 to 2027-07-24',
    durationDays: 9,
    adultsCount: 2,
    childrenCount: 2,
    budgetRange: '$5,000+ per person',
    travelStyle: 'Family Wildlife Safari',
    preferredExperiences: ['Great Migration River Crossing', 'Ngorongoro Crater', 'Hot Air Balloon Safari'],
    accommodationType: 'Luxury Tented Camps with Family Suites',
    notes: 'Children are ages 11 and 14. We want a private 4x4 Land Cruiser throughout.',
    status: 'Confirmed',
    statusNotes: 'Deposit of 30% secured. Migration mobile camp family suite locked. Private Land Cruiser assigned to senior guide Joseph.',
    quotedAmount: 16800,
    adminNotes: ['Family safari briefing sent to client', 'Balloon operator confirmed launch slot']
  },
  {
    id: 'inq-003',
    reference: 'MMS-2026-9043',
    createdAt: '2026-10-26T02:20:00Z',
    customerName: 'Dr. Sarah Jenkins',
    customerEmail: 'sarah.jenkins@oxford.ac.uk',
    customerPhone: '+44 7700 900821',
    preferredContact: 'email',
    destinations: ['Kenya', 'South Africa'],
    travelDates: '2027-05-01 to 2027-05-14',
    durationDays: 14,
    adultsCount: 1,
    childrenCount: 0,
    budgetRange: '$3,000 - $5,000 per person',
    travelStyle: 'Wildlife Photography Solo',
    preferredExperiences: ['Amboseli Big Tuskers', 'Sabi Sands Leopard Tracking', 'Cape Winelands'],
    accommodationType: 'Boutique Safari Lodges',
    notes: 'Bringing 400mm and 600mm telephoto lenses. Need vehicle with beanbags and camera charging ports.',
    status: 'Under review',
    statusNotes: 'Field specialist reviewing vehicle allocation and private conservancy permits.',
    quotedAmount: 8900,
    adminNotes: ['Check camera vehicle availability for May 2027']
  }
];

export const StorageService = {
  getTripInquiries(): TripInquiry[] {
    try {
      const stored = localStorage.getItem(TRIP_INQUIRIES_KEY);
      if (!stored) {
        localStorage.setItem(TRIP_INQUIRIES_KEY, JSON.stringify(INITIAL_TRIP_INQUIRIES));
        return INITIAL_TRIP_INQUIRIES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_TRIP_INQUIRIES;
    }
  },

  async syncWithFirestore(): Promise<TripInquiry[]> {
    try {
      const remoteInquiries = await FirestoreService.getAllInquiries();
      if (remoteInquiries && remoteInquiries.length > 0) {
        const local = this.getTripInquiries();
        // Merge without duplicates by reference
        const refMap = new Map<string, TripInquiry>();
        remoteInquiries.forEach(i => refMap.set(i.reference, i));
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

    return newInquiry;
  },

  updateTripInquiryStatus(reference: string, status: InquiryStatus, statusNotes?: string, adminNote?: string, quotedAmount?: number): boolean {
    const inquiries = this.getTripInquiries();
    const index = inquiries.findIndex(i => i.reference === reference);
    if (index === -1) return false;

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

    return newRecord;
  }
};
