export type TripType = 
  | 'wildlife-safari'
  | 'gorilla-trekking'
  | 'wildlife-photography'
  | 'great-migration'
  | 'beach-holiday'
  | 'cultural-experience'
  | 'luxury-lodge'
  | 'family-safari'
  | 'multi-country'
  | 'custom-itinerary';

export type DestinationRegion = 'East Africa' | 'Southern Africa' | 'Middle East' | 'Asia' | 'North Africa';

export type ContentPublicationStatus = 'Published' | 'Draft' | 'Unpublished';

export interface GalleryMediaItem {
  id: string;
  title: string;
  caption?: string;
  url: string;
  thumbnailUrl?: string;
  targetType: 'destination' | 'package' | 'tour' | 'stay' | 'general';
  targetId?: string;
  targetName?: string;
  createdAt: string;
  order?: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: DestinationRegion;
  location?: string;
  tagline: string;
  heroImage: string;
  gallery: string[];
  description: string;
  fullDescription?: string;
  keyAttractions: {
    name: string;
    description: string;
    image: string;
  }[];
  recommendedExperiences: string[];
  highlights?: string[];
  bestTimeToVisit: string;
  climate: string;
  currency: string;
  visaInfo: string;
  wildlifeHighlights: string[];
  featured?: boolean;
  status?: ContentPublicationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TourItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string;
}

export interface SafariTour {
  id: string;
  slug: string;
  title: string;
  destination: string;
  destinationSlug: string;
  durationDays: number;
  indicativePrice?: number;
  priceNote?: string;
  heroImage: string;
  summary: string;
  highlights: string[];
  itinerary: TourItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  physicalRating: 'Easy' | 'Moderate' | 'Challenging';
  maxGroupSize: number;
  featured?: boolean;
  status?: ContentPublicationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TravelPackage {
  id: string;
  slug: string;
  title: string;
  country?: string;
  destination?: string;
  destinations: string[];
  location?: string;
  duration: string;
  daysCount?: number;
  nightsCount?: number;
  heroImage: string;
  gallery?: string[];
  overview: string;
  fullDescription?: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary?: TourItineraryDay[];
  indicativePrice?: number;
  currency?: string;
  priceType?: string;
  priceNote?: string;
  category: string;
  featured?: boolean;
  status?: ContentPublicationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Accommodation {
  id: string;
  slug: string;
  name: string;
  type: 'Safari Lodge' | 'Luxury Tented Camp' | 'Boutique Hotel' | 'Eco Retreat' | 'Beach Resort' | 'Desert Haven';
  destination: string;
  destinationSlug: string;
  location: string;
  heroImage: string;
  gallery: string[];
  description: string;
  amenities: string[];
  capacityNote: string;
  checkInTime: string;
  checkOutTime: string;
  indicativePricePerNight?: number;
  priceNote?: string;
}

export type InquiryStatus = 
  | 'PENDING_REVIEW'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'AWAITING_PAYMENT'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'Inquiry received'
  | 'Under review'
  | 'Quotation prepared'
  | 'Deposit pending';

export interface BusinessSettings {
  businessName: string;
  supportEmail: string;
  adminEmail: string;
  phone: string;
  address: string;
  websiteUrl: string;
  inquiryNotificationsEnabled: boolean;
  bookingNotificationsEnabled: boolean;
  statusNotificationsEnabled: boolean;
  customerConfirmationsEnabled: boolean;
  providerType: 'formsubmit' | 'emailjs' | 'firestore_queue' | 'resend' | 'smtp';
  emailJsServiceId?: string;
  emailJsTemplateId?: string;
  emailJsPublicKey?: string;
  resendApiKey?: string;
  updatedAt?: string;
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  recipient: string;
  subject: string;
  type: 'customer_inquiry' | 'support_inquiry' | 'customer_booking' | 'support_booking' | 'status_update' | 'test';
  reference: string;
  status: 'DELIVERED' | 'SENT_TO_PROVIDER' | 'QUEUED' | 'FAILED';
  errorMessage?: string;
  provider?: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType: 'page_view' | 'destination_view' | 'tour_view' | 'inquiry_submitted' | 'booking_submitted' | 'login' | 'signup';
  page: string;
  path: string;
  timestamp: string;
  sessionId: string;
  device: 'desktop' | 'mobile' | 'tablet';
  referrer: string;
  metadata?: Record<string, any>;
}

export interface TripInquiry {
  id: string;
  reference: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  destinations: string[];
  travelDates: string;
  durationDays?: number;
  adultsCount: number;
  childrenCount: number;
  budgetRange: string;
  travelStyle: string;
  preferredExperiences: string[];
  accommodationType: string;
  notes?: string;
  status: InquiryStatus;
  statusNotes?: string;
  adminNotes?: string[];
  assignedAdmin?: string;
  quotedAmount?: number;
}

export interface FlightInquiry {
  id: string;
  reference: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'round-trip' | 'one-way' | 'multi-city';
  passengersCount: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  preferredAirline?: string;
  flexibleDates: boolean;
  notes?: string;
  status: InquiryStatus;
  quotedAmount?: number;
}

export interface TourBookingInquiry {
  id: string;
  reference: string;
  createdAt: string;
  tourId: string;
  tourTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  travelersCount: number;
  specialRequests?: string;
  status: InquiryStatus;
  totalEstimatedPrice?: number;
}

export interface TravelGuide {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  publishDate: string;
  author: string;
  heroImage: string;
  excerpt: string;
  content: string[];
  tags: string[];
}

export interface FAQItem {
  id: string;
  category: 'Safaris & Wildlife' | 'Gorilla Permits' | 'Visas & Health' | 'Booking & Payments' | 'What to Pack';
  question: string;
  answer: string;
}
