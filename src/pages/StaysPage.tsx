import React, { useState } from 'react';
import { ACCOMMODATIONS } from '../data/staysData';
import { CinematicVideo } from '../components/common/CinematicVideo';
import { WishlistButton } from '../components/common/WishlistButton';
import { TransportService } from '../services/transportService';
import { StorageService } from '../services/storageService';
import { 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Calendar, 
  Users, 
  BedDouble, 
  Building2, 
  Check, 
  AlertCircle,
  Phone,
  Mail
} from 'lucide-react';
import { ScrollReveal, MaskedTextReveal } from '../components/animations/ScrollReveal';

interface StaysPageProps {
  onNavigate: (path: string) => void;
}

const BRAND_COLORS: Record<string, string> = {
  Kenya: '#8A8F64',
  'South Africa': '#4A4238',
  Uganda: '#BA5F27',
  Tanzania: '#B83C25',
  Rwanda: '#7C6119',
  Dubai: '#00B3D2',
  Thailand: '#2CB2A5',
  Bali: '#5F7361',
  Egypt: '#365D9D'
};

const DESTINATION_CITIES: Record<string, string[]> = {
  Uganda: [
    'Kampala',
    'Entebbe',
    'Jinja',
    'Bwindi Impenetrable Forest',
    'Murchison Falls',
    'Queen Elizabeth National Park',
    'Fort Portal / Kibale Forest',
    'Lake Bunyonyi',
    'Kidepo Valley'
  ],
  Kenya: [
    'Nairobi',
    'Mombasa',
    'Diani Beach',
    'Watamu',
    'Lamu Island',
    'Maasai Mara',
    'Amboseli National Park',
    'Tsavo National Park',
    'Kisumu',
    'Lake Nakuru',
    'Lake Naivasha'
  ],
  Tanzania: [
    'Arusha',
    'Serengeti National Park',
    'Ngorongoro Crater',
    'Zanzibar (Stone Town)',
    'Zanzibar (Beaches)',
    'Dar es Salaam',
    'Moshi / Kilimanjaro',
    'Tarangire'
  ],
  Rwanda: [
    'Kigali',
    'Musanze / Volcanoes National Park',
    'Rubavu / Lake Kivu',
    'Nyungwe Forest',
    'Akagera National Park'
  ],
  'South Africa': [
    'Cape Town',
    'Sabi Sand / Greater Kruger',
    'Franschhoek / Cape Winelands',
    'Johannesburg',
    'Garden Route'
  ],
  Dubai: [
    'Dubai Marina & Beach',
    'Al Qudra Desert',
    'Palm Jumeirah',
    'Downtown Dubai'
  ],
  Egypt: [
    'Cairo & Giza',
    'Luxor',
    'Aswan',
    'Sharm El Sheikh / Red Sea'
  ],
  Thailand: [
    'Bangkok',
    'Phuket',
    'Chiang Mai',
    'Koh Samui'
  ],
  Bali: [
    'Ubud',
    'Uluwatu',
    'Seminyak',
    'Canggu'
  ],
  Other: [
    'Custom / Multi-Destination'
  ]
};

const ACCOMMODATION_TYPES = [
  'No preference / Best recommendation',
  'Luxury Tented Camp',
  'Safari Lodge',
  'Boutique Hotel',
  'Beachfront Villa / Resort',
  'Eco Retreat',
  'City Hotel'
];

export const StaysPage: React.FC<StaysPageProps> = ({ onNavigate }) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  // Form State
  const [formCountry, setFormCountry] = useState<string>('Uganda');
  const [formCity, setFormCity] = useState<string>(DESTINATION_CITIES['Uganda'][0]);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [roomPreference, setRoomPreference] = useState<'Private room' | 'Shared room' | 'No preference'>('Private room');
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [accommodationCategory, setAccommodationCategory] = useState<string>('No preference / Best recommendation');
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-calculate nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diff = new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };
  const calculatedNights = calculateNights();

  // Country change handler updates city dropdown dynamically
  const handleCountryChange = (c: string) => {
    setFormCountry(c);
    const cities = DESTINATION_CITIES[c] || ['Main City'];
    setFormCity(cities[0]);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Please provide your full name, email address, and phone / WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const totalGuests = adultsCount + childrenCount;
      const result = await TransportService.submitTransportInquiry({
        inquiryType: 'hotel_arrangement',
        departureCountry: formCountry,
        departureCity: formCity,
        destinationCountry: formCountry,
        destinationCity: formCity,
        departureDate: checkInDate || 'Flexible dates',
        returnDate: checkOutDate || undefined,
        isReturnJourney: !!checkOutDate,
        flexibleDates: !checkInDate,
        travelersCount: totalGuests,
        adultsCount,
        childrenCount,
        luggageNotes: `${calculatedNights > 0 ? `${calculatedNights} Nights` : 'Flexible duration'}, ${roomsCount} Room(s) (${roomPreference})`,
        additionalDetails: `Accommodation Category: ${accommodationCategory}. Room Preference: ${roomPreference}. Rooms: ${roomsCount}. Destination: ${formCity}, ${formCountry}.`,
        preferredTransportModes: ['safari_cruiser'],
        travelPreferences: [accommodationCategory, roomPreference],
        privateBudget: {
          estimatedAmount: 'Accommodation Proposal requested',
          currency: 'USD',
          budgetType: 'group_total',
          includesAccommodation: true,
          includesTransport: false,
          includesMeals: true,
          includesActivities: false,
          notes: ''
        },
        accommodationRequired: true,
        hotelCategory: accommodationCategory as any,
        roomCount: roomsCount,
        customerName,
        customerEmail,
        customerPhone,
        countryOfResidence: formCountry,
        preferredContactMethod: 'whatsapp',
        notes: `[ACCOMMODATION REQUEST]\nDestination: ${formCity}, ${formCountry}\nCheck-in: ${checkInDate || 'TBD'} | Check-out: ${checkOutDate || 'TBD'} (${calculatedNights} nights)\nGuests: ${adultsCount} Adults, ${childrenCount} Children (${totalGuests} Total)\nRooms: ${roomsCount} (${roomPreference})\nPreferred Category: ${accommodationCategory}\nSpecial Requirements: ${additionalRequirements || 'None'}`
      });

      // Also register in local trip inquiry storage
      StorageService.saveTripInquiry({
        customerName,
        customerEmail,
        customerPhone,
        preferredContact: 'whatsapp',
        destinations: [formCountry, formCity],
        travelDates: `${checkInDate || 'Flexible'} to ${checkOutDate || 'Flexible'}`,
        durationDays: calculatedNights > 0 ? calculatedNights + 1 : 1,
        adultsCount,
        childrenCount,
        budgetRange: 'Personalized Lodging Quote',
        travelStyle: `Accommodation: ${accommodationCategory}`,
        preferredExperiences: [roomPreference, `${roomsCount} Room(s)`],
        accommodationType: accommodationCategory,
        notes: `Requested accommodation in ${formCity}, ${formCountry}. Preferences: ${additionalRequirements}`
      });

      setSubmittedRef(result.reference);
      window.scrollTo({ top: 350, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit accommodation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const types = ['all', 'Luxury Tented Camp', 'Safari Lodge', 'Boutique Hotel', 'Eco Retreat', 'Desert Haven'];

  const filtered = ACCOMMODATIONS.filter(item => {
    return selectedType === 'all' || item.type === selectedType;
  });

  return (
    <div className="pt-24 pb-24 bg-[#F7F4ED] overflow-x-hidden">
      {/* Editorial Dark Header */}
      <div className="relative bg-[#0f0f0f] text-[#F7F4ED] py-24 sm:py-32 px-4 sm:px-8 lg:px-12 overflow-hidden">
        <CinematicVideo
          src="/media/videos/Mont_Rochelle_Hero_Video.mp4"
          mobileObjectPosition="center 35%"
          desktopObjectPosition="center center"
          priority={true}
          opacityClassName="opacity-20"
          containerClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-[#0f0f0f]/80 pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto text-center">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#B69A68] font-sans font-semibold block mb-4">
              Lodges, Tented Camps & Sanctuaries
            </span>
          </ScrollReveal>
          <MaskedTextReveal delay={0.2}>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white mb-6 leading-[1.05]">
              Stays Worth Traveling For.
            </h1>
          </MaskedTextReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-sm sm:text-base text-[#D9D0C2]/80 font-light max-w-2xl mx-auto leading-relaxed mb-4">
              From Sir Richard Branson’s Mahali Mzuri in the Maasai Mara to the cliffside treehouse suites of Ulusaba, gorilla sanctuaries in Bwindi, and vineyard estates in Franschhoek — explore our handpicked properties.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* ON-PAGE ACCOMMODATION REQUEST FORM */}
      <div className="relative -mt-12 z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-white border border-[#D9D0C2] p-8 sm:p-12 shadow-xl relative">
          {submittedRef ? (
            <div className="py-12 text-center animate-fadeIn">
              <div className="w-16 h-16 bg-[#B69A68]/15 text-[#B69A68] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#78634B] font-semibold block mb-2">
                Accommodation Request Logged
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#20221F] mb-3">
                Thank You, {customerName}
              </h3>
              <p className="text-sm text-[#20221F]/75 font-light leading-relaxed max-w-lg mx-auto mb-6">
                Your lodging inquiry for {formCity}, {formCountry} has been recorded with reference:
              </p>
              <div className="inline-block bg-[#F7F4ED] border border-[#B69A68]/40 px-6 py-3 mb-8">
                <span className="text-xs uppercase tracking-wider text-[#78634B] block font-mono">Reference Code</span>
                <span className="font-mono text-xl font-semibold text-[#20221F] tracking-wider">{submittedRef}</span>
              </div>
              <p className="text-xs text-[#20221F]/70 max-w-md mx-auto mb-8 font-light">
                Our reservations team is checking room allocations and seasonal availability. We will contact you via WhatsApp and Email with personalized lodge recommendations.
              </p>
              <button
                onClick={() => {
                  setSubmittedRef(null);
                  setAdditionalRequirements('');
                }}
                className="px-8 py-3 bg-[#20221F] hover:bg-[#343C32] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-8">
              <div className="border-b border-[#D9D0C2] pb-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#78634B] font-semibold block mb-1">
                  Bespoke Lodging & Stays
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#20221F]">
                  Request Accommodation
                </h2>
                <p className="text-xs text-[#20221F]/70 font-light mt-1">
                  Select your desired destination and dates. Our concierge will secure ideal rooms and verified allocations.
                </p>
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1 & 2: Country & Dynamically Filtered City */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#78634B] mb-3 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B69A68]" />
                  1. Destination Location
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Country *
                    </label>
                    <select
                      value={formCountry}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    >
                      {Object.keys(DESTINATION_CITIES).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      City / Sanctuary / Area *
                    </label>
                    <select
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    >
                      {(DESTINATION_CITIES[formCountry] || ['Main Area']).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Dates & Auto Calculated Nights */}
              <div className="pt-6 border-t border-[#D9D0C2]/60">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#78634B] flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#B69A68]" />
                    2. Check-in & Check-out Dates
                  </h4>
                  {calculatedNights > 0 && (
                    <span className="text-xs font-semibold px-3 py-1 bg-[#B69A68]/15 text-[#78634B] border border-[#B69A68]/30">
                      {calculatedNights} {calculatedNights === 1 ? 'Night' : 'Nights'}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4 & 5: Guests & Room Preferences */}
              <div className="pt-6 border-t border-[#D9D0C2]/60">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#78634B] mb-3 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#B69A68]" />
                  3. Guests & Room Preferences
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Adults
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={adultsCount}
                      onChange={(e) => setAdultsCount(Number(e.target.value))}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Children
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Room Preference
                    </label>
                    <select
                      value={roomPreference}
                      onChange={(e) => setRoomPreference(e.target.value as any)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    >
                      <option value="Private room">Private Room</option>
                      <option value="Shared room">Shared Room / Twin</option>
                      <option value="No preference">No Preference</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Number of Rooms
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={25}
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(Number(e.target.value))}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 6: Accommodation Type & Special Requirements */}
              <div className="pt-6 border-t border-[#D9D0C2]/60">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#78634B] mb-3 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#B69A68]" />
                  4. Accommodation Category & Special Requests
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Preferred Category
                    </label>
                    <select
                      value={accommodationCategory}
                      onChange={(e) => setAccommodationCategory(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    >
                      {ACCOMMODATION_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Additional Requirements or Preferences (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. King-size bed, private pool, balcony with valley view, accessibility needs, dietary requirements..."
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] p-3 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 7: Contact Information */}
              <div className="pt-6 border-t border-[#D9D0C2]/60">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#78634B] mb-3 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#B69A68]" />
                  5. Your Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Morrison"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. david@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +256 782 844 193"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-4 bg-[#20221F] hover:bg-[#343C32] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 shadow-md"
                >
                  <Send className="w-4 h-4 text-[#B69A68]" />
                  <span>{isSubmitting ? 'Submitting Request...' : 'Request Accommodation'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* CURATED REAL HOTEL PHOTOGRAPHS & EXAMPLES */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 border-b border-[#D9D0C2] pb-6 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#78634B] font-semibold block mb-2">
              Curated Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#20221F]">
              Handpicked Wilderness & Heritage Stays
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-4 py-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                  selectedType === t
                    ? 'bg-[#20221F] text-white'
                    : 'bg-white text-[#78634B] border border-[#D9D0C2] hover:bg-[#D9D0C2]/40'
                }`}
              >
                {t === 'all' ? 'All Stays' : t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filtered.map((stay, idx) => {
            const brandColor = BRAND_COLORS[stay.destination] || '#78634B';

            return (
              <ScrollReveal key={stay.slug} direction="up" delay={0.1 + (idx % 3) * 0.1}>
                <div
                  onClick={() => onNavigate(`/stays/${stay.slug}`)}
                  className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden flex flex-col hover-lift h-full relative shadow-xs"
                >
                  {/* Floating Badge */}
                  <div
                    className="floating-badge"
                    style={{ backgroundColor: brandColor, color: 'white' }}
                  >
                    {stay.type}
                  </div>

                  {/* Stay Hero Image */}
                  <div className="relative h-72 sm:h-80 overflow-hidden bg-[#20221F]">
                    <img
                      src={stay.heroImage}
                      alt={stay.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute top-3 right-3 z-10">
                      <WishlistButton
                        item={{
                          itemId: stay.id,
                          itemType: 'stay',
                          slug: stay.slug,
                          title: stay.name,
                          heroImage: stay.heroImage,
                          location: `${stay.destination} · ${stay.location}`,
                          priceNote: (stay as any).isPricePublished && (stay as any).publishedPrice
                            ? `$${(stay as any).publishedPrice}/night`
                            : undefined
                        }}
                        variant="icon"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#78634B] font-medium mb-2">
                        <MapPin className="w-3.5 h-3.5" style={{ color: brandColor }} />
                        <span>{stay.location}</span>
                      </div>
                      <h3 className="font-serif text-2xl font-light text-[#20221F] group-hover:text-[#78634B] transition-colors mb-3 leading-snug">
                        {stay.name}
                      </h3>
                      <p className="text-xs text-[#20221F]/70 leading-relaxed font-light mb-6 line-clamp-3">
                        {stay.description}
                      </p>

                      <div className="space-y-1 mb-6 pt-4 border-t border-[#D9D0C2]/40 text-xs text-[#20221F]/60 font-light">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#78634B] block">
                          Capacity & Setting:
                        </span>
                        <span>{stay.capacityNote}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#D9D0C2] flex items-center justify-between text-xs">
                      {(stay as any).isPricePublished && (stay as any).publishedPrice ? (
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 block">From</span>
                          <span className="font-serif text-lg font-semibold text-[#20221F]">
                            ${(stay as any).publishedPrice} <span className="text-xs font-normal text-[#20221F]/50">/ night</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#78634B] font-medium text-[11px]">
                          {stay.destination}
                        </span>
                      )}
                      <span
                        className="px-4 py-2 bg-[#0f0f0f] text-white text-[11px] uppercase tracking-[0.15em] font-semibold hover:bg-[#78634B] transition-colors"
                      >
                        View Lodge
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
};
