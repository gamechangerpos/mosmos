import React, { useState } from 'react';
import { TransportService } from '../services/transportService';
import { CinematicVideo } from '../components/common/CinematicVideo';
import { ScrollReveal, MaskedTextReveal } from '../components/animations/ScrollReveal';
import { 
  CheckCircle2, 
  Send, 
  Calendar, 
  Users, 
  MapPin, 
  Compass, 
  Car, 
  Bus, 
  Plane, 
  Phone, 
  Mail, 
  AlertCircle,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';

interface TransportationPageProps {
  onNavigate: (path: string) => void;
}

const COUNTRIES = [
  'Uganda',
  'Kenya',
  'Tanzania',
  'Rwanda',
  'South Africa',
  'Dubai',
  'Thailand',
  'Bali',
  'Ethiopia',
  'Egypt',
  'Other / Multi-Country'
];

const TRANSPORT_MODES = [
  { value: 'No preference', label: 'No preference / Best recommendation' },
  { value: 'Bus', label: 'Executive Bus / Coach' },
  { value: 'Private car', label: 'Private Car / 4x4 Safari Cruiser' },
  { value: 'Shared transportation', label: 'Shared Transportation' },
  { value: 'Airplane', label: 'Scheduled Domestic / Regional Airplane' },
  { value: 'Private jet', label: 'Private Jet / Air Charter' },
  { value: 'Other', label: 'Other (Train, Ferry, Specific transfer)' }
];

const ADDITIONAL_SERVICES = [
  { value: 'Transportation only', label: 'Transportation only' },
  { value: 'Transportation and accommodation', label: 'Transportation and accommodation' },
  { value: 'Transportation and city tour', label: 'Transportation and city tour' },
  { value: 'Transportation and guided tour', label: 'Transportation and guided safari/tour' },
  { value: 'Complete travel arrangement', label: 'Complete travel arrangement (All-inclusive)' }
];

export const TransportationPage: React.FC<TransportationPageProps> = ({ onNavigate }) => {
  // Form State
  const [formData, setFormData] = useState({
    // Contact
    fullName: '',
    email: '',
    phoneWhatsApp: '',
    
    // Destinations
    destinationCountry: 'Uganda',
    departureCountry: 'Uganda',
    startingLocation: '',
    destinationCity: '',
    
    // Transport & Services
    transportMode: 'No preference',
    additionalServices: 'Transportation only',
    
    // Dates & Travelers
    travelersCount: 2,
    departureDate: '',
    returnDate: '',
    daysCount: 3,
    nightsCount: 2,
    
    // Accommodation
    accommodationRequired: 'No',
    accommodationGuestsCount: 2,
    accommodationPreferences: '',
    
    // Comments
    additionalComments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phoneWhatsApp.trim()) {
      setErrorMessage('Please provide your full name, email address, and phone / WhatsApp number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const isAccomm = formData.accommodationRequired === 'Yes';
      const result = await TransportService.submitTransportInquiry({
        inquiryType: formData.additionalServices.includes('Complete') ? 'custom_trip' : 'transport_only',
        departureCountry: formData.departureCountry || 'Not specified',
        departureCity: formData.startingLocation || formData.departureCountry || 'Flexible',
        destinationCountry: formData.destinationCountry,
        destinationCity: formData.destinationCity || formData.destinationCountry,
        departureDate: formData.departureDate || 'Flexible dates',
        returnDate: formData.returnDate || undefined,
        isReturnJourney: !!formData.returnDate,
        flexibleDates: !formData.departureDate,
        travelersCount: Number(formData.travelersCount) || 1,
        adultsCount: Number(formData.travelersCount) || 1,
        childrenCount: 0,
        luggageNotes: `Duration: ${formData.daysCount} days, ${formData.nightsCount} nights`,
        additionalDetails: `Transport: ${formData.transportMode}. Service: ${formData.additionalServices}. Starting: ${formData.startingLocation || 'Not specified'}. Destination: ${formData.destinationCity || formData.destinationCountry}.`,
        preferredTransportModes: [formData.transportMode.toLowerCase().replace(/\s+/g, '_') as any],
        travelPreferences: [formData.transportMode, formData.additionalServices],
        privateBudget: {
          estimatedAmount: 'Private Quote requested',
          currency: 'USD',
          budgetType: 'group_total',
          includesAccommodation: isAccomm,
          includesTransport: true,
          includesMeals: false,
          includesActivities: formData.additionalServices.includes('tour'),
          notes: ''
        },
        accommodationRequired: isAccomm,
        hotelCategory: isAccomm ? 'recommend-for-me' : undefined,
        roomCount: isAccomm ? Math.ceil(Number(formData.accommodationGuestsCount) / 2) : undefined,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phoneWhatsApp,
        countryOfResidence: formData.departureCountry,
        preferredContactMethod: 'whatsapp',
        notes: `Additional Services: ${formData.additionalServices}\nDuration: ${formData.daysCount} Days / ${formData.nightsCount} Nights\nAccommodation Required: ${formData.accommodationRequired} (${isAccomm ? formData.accommodationGuestsCount + ' guests' : 'None'})\nAccommodation Preferences: ${formData.accommodationPreferences || 'None'}\nComments: ${formData.additionalComments || 'None'}`
      });

      setSubmissionSuccess(result.reference);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit your travel request. Please try again or reach out to our team via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-24 bg-[#F7F4ED] text-[#20221F] min-h-screen">
      
      {/* 1. CINEMATIC EDITORIAL HERO */}
      <section className="relative w-full h-[60vh] min-h-[460px] bg-[#20221F] overflow-hidden">
        <CinematicVideo
          src="/media/videos/Finch_Hattons_Hero_Video.mp4"
          mobileObjectPosition="center 30%"
          desktopObjectPosition="center center"
          priority={true}
          containerClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30 pointer-events-none" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10 max-w-4xl mx-auto">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#B69A68] font-semibold block mb-3">
              Regional Transit & Travel Logistics
            </span>
          </ScrollReveal>

          <MaskedTextReveal delay={0.2}>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#F7F4ED] tracking-wide mb-4 leading-tight">
              Transportation & Travel Arrangements
            </h1>
          </MaskedTextReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-xs sm:text-sm md:text-base text-[#D9D0C2] font-light max-w-2xl leading-relaxed">
              Tailored cross-border transit, private transfers, domestic flights, and complete travel coordination across East Africa and beyond.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. SHORT, NATURAL INTRODUCTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <ScrollReveal direction="up" delay={0.1}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#78634B] font-semibold block mb-3">
            Bespoke Travel Solutions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#20221F] mb-6">
            Effortless Journeys Across East Africa & Beyond
          </h2>
          <p className="text-sm sm:text-base text-[#20221F]/75 font-light leading-relaxed mb-6 max-w-3xl mx-auto">
            MOS MOS provides reliable transportation services and thoughtful travel arrangements tailored to your specific schedule, group size, and comfort preferences. Whether you are traveling between cities, crossing borders, flying into remote national parks, or requiring private chauffeur arrangements, our experienced logistical team ensures every leg of your journey is coordinated with care.
          </p>
          <p className="text-xs sm:text-sm text-[#78634B] font-normal leading-relaxed max-w-2xl mx-auto">
            Options for different needs and budgets · Cross-border border crossing assistance · Flexible travel arrangements · Coordinated lodging and guided extensions
          </p>
        </ScrollReveal>
      </section>

      {/* 3. CORE SERVICE HIGHLIGHTS (Simple & Clean) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#D9D0C2] p-6 shadow-xs">
            <Car className="w-6 h-6 text-[#B69A68] mb-3" />
            <h3 className="font-serif text-lg font-light text-[#20221F] mb-2">Cross-Border & Regional Transit</h3>
            <p className="text-xs text-[#20221F]/70 font-light leading-relaxed">
              Hassle-free transfers between Uganda, Kenya, Tanzania, and Rwanda with verified drivers, executive coaches, and border protocol support.
            </p>
          </div>

          <div className="bg-white border border-[#D9D0C2] p-6 shadow-xs">
            <Plane className="w-6 h-6 text-[#B69A68] mb-3" />
            <h3 className="font-serif text-lg font-light text-[#20221F] mb-2">Flights & Private Charters</h3>
            <p className="text-xs text-[#20221F]/70 font-light leading-relaxed">
              Scheduled bush flights directly to safari airstrips, intercity regional flights, and private air charters for rapid, comfortable arrivals.
            </p>
          </div>

          <div className="bg-white border border-[#D9D0C2] p-6 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[#B69A68] mb-3" />
            <h3 className="font-serif text-lg font-light text-[#20221F] mb-2">Complete Travel Planning</h3>
            <p className="text-xs text-[#20221F]/70 font-light leading-relaxed">
              Combine transportation with vetted hotel stays, city tours, safari guides, and custom daily itineraries managed under a single point of contact.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ON-PAGE TRANSPORTATION & TRAVEL REQUEST FORM */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-white border border-[#D9D0C2] p-8 sm:p-12 shadow-md relative">
          
          {submissionSuccess ? (
            /* Genuine Confirmation Display */
            <div className="py-12 text-center animate-fadeIn">
              <div className="w-16 h-16 bg-[#B69A68]/15 text-[#B69A68] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#78634B] font-semibold block mb-2">
                Request Successfully Received
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#20221F] mb-3">
                Thank You, {formData.fullName}
              </h3>
              <p className="text-sm text-[#20221F]/75 font-light leading-relaxed max-w-lg mx-auto mb-6">
                Your travel arrangement request has been registered in our operational system with reference:
              </p>
              <div className="inline-block bg-[#F7F4ED] border border-[#B69A68]/40 px-6 py-3 mb-8">
                <span className="text-xs uppercase tracking-wider text-[#78634B] block font-mono">Reference Code</span>
                <span className="font-mono text-xl font-semibold text-[#20221F] tracking-wider">{submissionSuccess}</span>
              </div>
              <p className="text-xs text-[#20221F]/70 max-w-md mx-auto mb-8 font-light">
                Our logistics coordinator is reviewing your destination, preferred transit mode, and schedule. We will contact you via WhatsApp and Email within a few hours with tailored arrangement options.
              </p>
              <button
                onClick={() => {
                  setSubmissionSuccess(null);
                  setFormData({
                    fullName: '',
                    email: '',
                    phoneWhatsApp: '',
                    destinationCountry: 'Uganda',
                    departureCountry: 'Uganda',
                    startingLocation: '',
                    destinationCity: '',
                    transportMode: 'No preference',
                    additionalServices: 'Transportation only',
                    travelersCount: 2,
                    departureDate: '',
                    returnDate: '',
                    daysCount: 3,
                    nightsCount: 2,
                    accommodationRequired: 'No',
                    accommodationGuestsCount: 2,
                    accommodationPreferences: '',
                    additionalComments: ''
                  });
                }}
                className="px-8 py-3 bg-[#20221F] hover:bg-[#343C32] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            /* The Single On-Page Form */
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="border-b border-[#D9D0C2] pb-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#78634B] font-semibold block mb-1">
                  Direct Coordination
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#20221F]">
                  Request Transportation & Travel Arrangements
                </h3>
                <p className="text-xs text-[#20221F]/70 font-light mt-1">
                  Fill in your travel preferences below. Our desk will tailor a personalized logistical proposal for you.
                </p>
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Contact Information */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#78634B] mb-4 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#B69A68]" />
                  1. Your Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phoneWhatsApp"
                      required
                      placeholder="e.g. +256 782 844 193"
                      value={formData.phoneWhatsApp}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Destination & Departure */}
              <div className="pt-6 border-t border-[#D9D0C2]/60">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#78634B] mb-4 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B69A68]" />
                  2. Destination & Route
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Destination Country *
                    </label>
                    <select
                      name="destinationCountry"
                      value={formData.destinationCountry}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Specific Destination City or Park (Optional)
                    </label>
                    <input
                      type="text"
                      name="destinationCity"
                      placeholder="e.g. Nairobi, Maasai Mara, Diani Beach, Bwindi"
                      value={formData.destinationCity}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Starting Location / Departure Country
                    </label>
                    <select
                      name="departureCountry"
                      value={formData.departureCountry}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Starting City / Pickup Point (Optional)
                    </label>
                    <input
                      type="text"
                      name="startingLocation"
                      placeholder="e.g. Kampala, Entebbe Airport, Kisumu, JKIA"
                      value={formData.startingLocation}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Transportation Mode & Additional Services */}
              <div className="pt-6 border-t border-[#D9D0C2]/60">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#78634B] mb-4 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#B69A68]" />
                  3. Transportation & Services
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Preferred Mode of Transportation
                    </label>
                    <select
                      name="transportMode"
                      value={formData.transportMode}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    >
                      {TRANSPORT_MODES.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Additional Services Needed
                    </label>
                    <select
                      name="additionalServices"
                      value={formData.additionalServices}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    >
                      {ADDITIONAL_SERVICES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Travel Details: Dates, Days, Nights & Travelers */}
              <div className="pt-6 border-t border-[#D9D0C2]/60">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#78634B] mb-4 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#B69A68]" />
                  4. Travel Schedule & Party Size
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Travelers
                    </label>
                    <input
                      type="number"
                      name="travelersCount"
                      min={1}
                      max={50}
                      value={formData.travelersCount}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Return Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Number of Days
                    </label>
                    <input
                      type="number"
                      name="daysCount"
                      min={1}
                      max={90}
                      value={formData.daysCount}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Number of Nights
                    </label>
                    <input
                      type="number"
                      name="nightsCount"
                      min={0}
                      max={90}
                      value={formData.nightsCount}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Accommodation Requirements */}
              <div className="pt-6 border-t border-[#D9D0C2]/60">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#78634B] mb-4 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#B69A68]" />
                  5. Accommodation Requirements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                      Is Accommodation Required?
                    </label>
                    <select
                      name="accommodationRequired"
                      value={formData.accommodationRequired}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                    >
                      <option value="No">No — Transportation only</option>
                      <option value="Yes">Yes — Please arrange accommodation</option>
                    </select>
                  </div>
                  {formData.accommodationRequired === 'Yes' && (
                    <>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                          Guests Needing Accommodation
                        </label>
                        <input
                          type="number"
                          name="accommodationGuestsCount"
                          min={1}
                          max={50}
                          value={formData.accommodationGuestsCount}
                          onChange={handleInputChange}
                          className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                          Lodging Style / Room Preferences
                        </label>
                        <input
                          type="text"
                          name="accommodationPreferences"
                          placeholder="e.g. Luxury lodge, beach resort, single rooms"
                          value={formData.accommodationPreferences}
                          onChange={handleInputChange}
                          className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 6. Additional Comments */}
              <div className="pt-6 border-t border-[#D9D0C2]/60">
                <label className="block text-[11px] uppercase tracking-wider text-[#20221F]/70 mb-1 font-medium">
                  Additional Comments or Special Requests (Optional)
                </label>
                <textarea
                  name="additionalComments"
                  rows={3}
                  placeholder="Share any special timing, flight arrival details, luggage notes, or specific stopovers..."
                  value={formData.additionalComments}
                  onChange={handleInputChange}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] p-3 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-4 bg-[#20221F] hover:bg-[#343C32] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 shadow-md"
                >
                  <Send className="w-4 h-4 text-[#B69A68]" />
                  <span>{isSubmitting ? 'Submitting Travel Request...' : 'Submit Travel Request'}</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </section>

      {/* 5. DIRECT CONTACT CALLOUT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-[#20221F]/70">
        <p className="font-light">
          Prefer immediate assistance with travel logistics? Reach our East African desks directly on WhatsApp:{' '}
          <a href="https://wa.me/256782844193" target="_blank" rel="noopener noreferrer" className="text-[#78634B] font-medium underline">
            +256 782 844 193 (Uganda)
          </a>{' '}
          or{' '}
          <a href="https://wa.me/254798277447" target="_blank" rel="noopener noreferrer" className="text-[#78634B] font-medium underline">
            +254 798 277 447 (Kenya)
          </a>
        </p>
      </section>

    </div>
  );
};
