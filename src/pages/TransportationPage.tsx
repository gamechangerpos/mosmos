import React, { useState, useEffect, useMemo } from 'react';
import { 
  TransportService, 
  INITIAL_VERIFIED_ROUTES, 
  INITIAL_VERIFIED_OPERATORS 
} from '../services/transportService';
import { 
  TransportRoute, 
  TransportOperator, 
  TransportMode 
} from '../types';
import { CinematicVideo } from '../components/common/CinematicVideo';
import { ScrollReveal, MaskedTextReveal } from '../components/animations/ScrollReveal';
import { 
  Compass, 
  Bus, 
  Train, 
  Ship, 
  Plane, 
  Car, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Send, 
  Calendar, 
  Users, 
  DollarSign, 
  Lock, 
  ExternalLink, 
  Building2, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  X,
  Filter,
  Sparkles
} from 'lucide-react';

interface TransportationPageProps {
  onNavigate: (path: string) => void;
  initialRouteId?: string;
}

type TabType = 'all' | 'cross-border' | 'kenya' | 'uganda' | 'tanzania' | 'rwanda' | 'custom-trips';

const COUNTRY_OPTIONS = [
  'Uganda',
  'Kenya',
  'Tanzania',
  'Rwanda'
];

const PREDEFINED_LOCATIONS: Record<string, string[]> = {
  Uganda: ['Kampala', 'Entebbe International Airport', 'Jinja', 'Murchison Falls National Park', 'Bwindi Impenetrable Forest', 'Queen Elizabeth National Park', 'Lake Bunyonyi', 'Fort Portal / Kibale Forest', 'Sipi Falls'],
  Kenya: ['Nairobi (CBD / JKIA)', 'Nairobi (Wilson Airport)', 'Mombasa Terminus', 'Diani Beach (Ukunda)', 'Watamu', 'Malindi', 'Lamu Island (Shela / Old Town)', 'Kilifi', 'Maasai Mara', 'Amboseli National Park', 'Tsavo National Park', 'Lake Nakuru', 'Lake Naivasha', 'Kisumu', 'Eldoret'],
  Tanzania: ['Dar es Salaam', 'Zanzibar (Stone Town)', 'Zanzibar (Nungwi / Paje)', 'Arusha', 'Moshi / Kilimanjaro Airport', 'Serengeti National Park', 'Ngorongoro Crater', 'Dodoma', 'Mwanza'],
  Rwanda: ['Kigali (Airport / CBD)', 'Musanze (Volcanoes National Park)', 'Rubavu (Lake Kivu)', 'Nyungwe Forest', 'Akagera National Park', 'Huye']
};

export const TransportationPage: React.FC<TransportationPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [operators, setOperators] = useState<TransportOperator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Inquiry Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'transport_only' | 'custom_trip' | 'hotel_arrangement'>('transport_only');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    departureCountry: 'Uganda',
    departureCity: 'Kampala',
    destinationCountry: 'Kenya',
    destinationCity: 'Nairobi',
    departureDate: '',
    returnDate: '',
    isReturnJourney: false,
    flexibleDates: true,
    travelersCount: 2,
    adultsCount: 2,
    childrenCount: 0,
    luggageNotes: '',
    additionalDetails: '',
    preferredTransportModes: ['bus', 'safari_cruiser'],
    preferredOperator: '',
    travelPreferences: ['comfortable', 'scenic'],
    // Private Budget (CONFIDENTIAL)
    estimatedBudget: '',
    currency: 'USD',
    budgetType: 'group_total' as 'per_person' | 'group_total',
    budgetIncludesAccommodation: true,
    budgetIncludesTransport: true,
    budgetIncludesMeals: false,
    budgetIncludesActivities: false,
    budgetNotes: '',
    // Accommodation Arrangements
    accommodationRequired: false,
    hotelCategory: 'recommend-for-me' as any,
    roomCount: 1,
    // Custom Trip Planning
    activitiesAndInterests: [] as string[],
    // Contact Details
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    countryOfResidence: '',
    preferredContactMethod: 'email' as 'email' | 'phone' | 'whatsapp',
    notes: ''
  });

  // Load verified routes & operators
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [fetchedRoutes, fetchedOperators] = await Promise.all([
        TransportService.getRoutes('all', false),
        TransportService.getOperators(false)
      ]);
      setRoutes(fetchedRoutes);
      setOperators(fetchedOperators);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter routes based on active tab and search query
  const filteredRoutes = useMemo(() => {
    return routes.filter(r => {
      // Tab matching
      if (activeTab === 'cross-border' && r.routeType !== 'cross-border') return false;
      if (activeTab === 'kenya' && !r.originCountry.includes('Kenya') && !r.destinationCountry.includes('Kenya')) return false;
      if (activeTab === 'uganda' && !r.originCountry.includes('Uganda') && !r.destinationCountry.includes('Uganda')) return false;
      if (activeTab === 'tanzania' && !r.originCountry.includes('Tanzania') && !r.destinationCountry.includes('Tanzania')) return false;
      if (activeTab === 'rwanda' && !r.originCountry.includes('Rwanda') && !r.destinationCountry.includes('Rwanda')) return false;

      // Search query matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          r.origin.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q) ||
          r.operatorName.toLowerCase().includes(q) ||
          r.transportType.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [routes, activeTab, searchQuery]);

  const handleOpenInquiryForRoute = (route: TransportRoute) => {
    setFormData(prev => ({
      ...prev,
      departureCountry: route.originCountry,
      departureCity: route.origin,
      destinationCountry: route.destinationCountry,
      destinationCity: route.destination,
      preferredOperator: route.operatorName,
      preferredTransportModes: [route.routeType === 'rail' ? 'train' : route.routeType === 'flight' ? 'domestic_flight' : route.routeType === 'ferry' ? 'ferry_boat' : 'safari_cruiser'],
      additionalDetails: `Interested in route: ${route.origin} to ${route.destination} via ${route.operatorName}.`
    }));
    setModalMode('transport_only');
    setIsModalOpen(true);
  };

  const handleOpenCustomTripModal = () => {
    setModalMode('custom_trip');
    setFormData(prev => ({
      ...prev,
      accommodationRequired: true
    }));
    setIsModalOpen(true);
  };

  const handleOpenHotelModal = () => {
    setModalMode('hotel_arrangement');
    setFormData(prev => ({
      ...prev,
      accommodationRequired: true,
      hotelCategory: 'safari-lodge'
    }));
    setIsModalOpen(true);
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.customerName.trim() || !formData.customerEmail.trim() || !formData.customerPhone.trim()) {
      setFormError('Please provide your name, valid email address, and telephone/WhatsApp number.');
      return;
    }

    if (!formData.departureCity.trim() || !formData.destinationCity.trim()) {
      setFormError('Please specify both your departure and destination locations.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await TransportService.submitTransportInquiry({
        inquiryType: modalMode,
        departureCountry: formData.departureCountry,
        departureCity: formData.departureCity,
        destinationCountry: formData.destinationCountry,
        destinationCity: formData.destinationCity,
        departureDate: formData.departureDate || 'Flexible 2026/2027',
        returnDate: formData.isReturnJourney ? (formData.returnDate || 'Flexible') : undefined,
        isReturnJourney: formData.isReturnJourney,
        flexibleDates: formData.flexibleDates,
        travelersCount: Number(formData.travelersCount) || 2,
        adultsCount: Number(formData.adultsCount) || 2,
        childrenCount: Number(formData.childrenCount) || 0,
        luggageNotes: formData.luggageNotes,
        additionalDetails: formData.additionalDetails,
        preferredTransportModes: formData.preferredTransportModes,
        preferredOperator: formData.preferredOperator,
        travelPreferences: formData.travelPreferences,
        privateBudget: {
          estimatedAmount: formData.estimatedBudget || 'Flexible / To be quoted',
          currency: formData.currency,
          budgetType: formData.budgetType,
          includesAccommodation: formData.budgetIncludesAccommodation,
          includesTransport: formData.budgetIncludesTransport,
          includesMeals: formData.budgetIncludesMeals,
          includesActivities: formData.budgetIncludesActivities,
          notes: formData.budgetNotes
        },
        accommodationRequired: formData.accommodationRequired,
        hotelCategory: formData.accommodationRequired ? formData.hotelCategory : undefined,
        roomCount: formData.accommodationRequired ? Number(formData.roomCount) : undefined,
        activitiesAndInterests: formData.activitiesAndInterests,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        countryOfResidence: formData.countryOfResidence,
        preferredContactMethod: formData.preferredContactMethod,
        notes: formData.notes
      });

      setSubmittedRef(result.reference);
    } catch (err: any) {
      setFormError(err?.message || 'An error occurred while submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTransportIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('train') || t.includes('rail') || t.includes('sgr')) return <Train className="w-4 h-4 text-[#B69A68]" />;
    if (t.includes('ferry') || t.includes('boat') || t.includes('dhow')) return <Ship className="w-4 h-4 text-[#B69A68]" />;
    if (t.includes('flight') || t.includes('air') || t.includes('plane')) return <Plane className="w-4 h-4 text-[#B69A68]" />;
    if (t.includes('bus') || t.includes('coach')) return <Bus className="w-4 h-4 text-[#B69A68]" />;
    return <Car className="w-4 h-4 text-[#B69A68]" />;
  };

  return (
    <div className="pt-24 pb-24 bg-[#F7F4ED] text-[#20221F] min-h-screen">
      
      {/* 1. CINEMATIC EDITORIAL HERO */}
      <section className="relative w-full h-[65vh] min-h-[480px] bg-[#20221F] overflow-hidden">
        <CinematicVideo
          src="/media/videos/Finch_Hattons_Hero_Video.mp4"
          mobileObjectPosition="center 30%"
          desktopObjectPosition="center center"
          priority={true}
          containerClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10 max-w-4xl mx-auto">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#B69A68] font-semibold block mb-3">
              Regional Transit & Bespoke Logistics
            </span>
          </ScrollReveal>

          <MaskedTextReveal delay={0.2}>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#F7F4ED] tracking-wide mb-4 leading-tight">
              Transportation & Travel Arrangements
            </h1>
          </MaskedTextReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-xs sm:text-sm md:text-base text-[#D9D0C2] font-light max-w-2xl leading-relaxed mb-8">
              Seamless cross-border journeys, luxury coastal transfers, standard gauge rail, domestic safari flights, and custom 4x4 private cruisers across Uganda, Kenya, Tanzania, and Rwanda.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setModalMode('transport_only');
                  setIsModalOpen(true);
                }}
                className="px-7 py-3 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer shadow-lg"
              >
                Request Travel Arrangement
              </button>
              <button
                onClick={handleOpenCustomTripModal}
                className="px-6 py-3 border border-white/30 text-white hover:bg-white hover:text-[#20221F] text-xs font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer backdrop-blur-sm"
              >
                Plan a Custom Itinerary
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. CONFIDENTIAL PRICING & BESPOKE QUOTATION BANNER */}
      <section className="bg-[#20221F] border-y border-[#343C32] py-4 px-4 sm:px-6 lg:px-8 text-xs text-[#D9D0C2]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#B69A68] shrink-0" />
            <span className="font-medium text-white">Private Quotations Guarantee:</span>
            <span className="font-light text-[#D9D0C2]/80 hidden sm:inline">
              All transportation costs, accommodation rates, and customized itineraries are tailored privately to your confidential budget. No public rates or fixed fares.
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#B69A68] font-semibold border border-[#B69A68]/30 px-3 py-1">
            Personalized Review & Dispatch
          </span>
        </div>
      </section>

      {/* 3. NAVIGATION SUB-TABS */}
      <section className="sticky top-16 z-30 bg-[#F7F4ED]/95 backdrop-blur-md border-b border-[#D9D0C2] py-3 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'cross-border', label: 'Intercountry Travel' },
              { id: 'kenya', label: 'Kenya (Coast, Rail & Safari)' },
              { id: 'uganda', label: 'Uganda Travel' },
              { id: 'tanzania', label: 'Tanzania & Zanzibar' },
              { id: 'rwanda', label: 'Rwanda Routes' },
              { id: 'custom-trips', label: 'Customized Trips & Hotels' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-all cursor-pointer whitespace-nowrap rounded-xs ${
                  activeTab === tab.id
                    ? 'bg-[#20221F] text-[#F7F4ED] shadow-sm'
                    : 'text-[#78634B] hover:text-[#20221F] hover:bg-[#D9D0C2]/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px] hidden lg:block">
            <input
              type="text"
              placeholder="Filter route or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#D9D0C2] text-xs px-3 py-1.5 focus:outline-none focus:border-[#B69A68]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. MAIN CONTENT & ROUTE DIRECTORY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Highlight Section: Customized Trips & Hotel Arrangements */}
        {activeTab === 'custom-trips' ? (
          <div className="space-y-12 animate-fadeIn">
            <div className="bg-white border border-[#D9D0C2] p-8 sm:p-12 shadow-sm rounded-xs">
              <div className="max-w-3xl">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#78634B] font-semibold block mb-2">
                  Complete Expedition Design
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#20221F] mb-4">
                  Customized Travel & Multi-Country Itineraries
                </h2>
                <p className="text-sm text-[#20221F]/70 leading-relaxed font-light mb-8">
                  Do not limit your journey to transportation alone. Our expedition directors curate complete circuits combining cross-border executive coaches, private charter bush flights, luxury tented camps, beach resorts, and guided primate treks.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-xs">
                  <div className="border border-[#D9D0C2] p-5 bg-[#F7F4ED]/40">
                    <Building2 className="w-5 h-5 text-[#B69A68] mb-2" />
                    <h3 className="font-serif text-lg font-light text-[#20221F] mb-1">Hotel & Lodge Arrangements</h3>
                    <p className="text-[#20221F]/70 font-light leading-relaxed">
                      Safari lodges in Maasai Mara & Bwindi, beachfront villas in Diani & Zanzibar, or boutique city retreats in Nairobi & Kigali. Selected to match your confidential budget.
                    </p>
                  </div>
                  <div className="border border-[#D9D0C2] p-5 bg-[#F7F4ED]/40">
                    <Compass className="w-5 h-5 text-[#B69A68] mb-2" />
                    <h3 className="font-serif text-lg font-light text-[#20221F] mb-1">End-to-End Transfers</h3>
                    <p className="text-[#20221F]/70 font-light leading-relaxed">
                      Airport chauffeurs, Madaraka Express SGR tickets, private 4x4 cruisers with pop-up photography roofs, and inter-island dhow boats smoothly synchronized.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleOpenCustomTripModal}
                    className="px-8 py-3.5 bg-[#20221F] hover:bg-[#343C32] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                  >
                    Request a Customized Travel Plan
                  </button>
                  <button
                    onClick={handleOpenHotelModal}
                    className="px-6 py-3.5 border border-[#20221F] text-[#20221F] hover:bg-[#20221F] hover:text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                  >
                    Inquire Accommodation Only
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#78634B] font-semibold block mb-1">
                  Verified Transit Options & Routes
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#20221F]">
                  {activeTab === 'kenya' ? 'Kenya: Coast, Rail, Islands & Wildlife Routes' :
                   activeTab === 'uganda' ? 'Uganda: Savannah, Primates & Intercity Routes' :
                   activeTab === 'tanzania' ? 'Tanzania: Rail, Maritime Ferries & Northern Circuit' :
                   activeTab === 'rwanda' ? 'Rwanda: Volcanoes & Western Highland Circuits' :
                   activeTab === 'cross-border' ? 'East African Cross-Border & Intercountry Travel' :
                   'East African Regional Transit Directory'}
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#20221F]/60">
                <span>Showing {filteredRoutes.length} Verified Routes</span>
                <button
                  onClick={() => {
                    setModalMode('transport_only');
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Custom Request
                </button>
              </div>
            </div>

            {/* Kenya Deep-Dive Spotlight Banner when Kenya tab is selected */}
            {activeTab === 'kenya' && (
              <div className="mb-10 bg-[#20221F] text-[#F7F4ED] p-6 sm:p-8 border-l-4 border-[#B69A68]">
                <div className="max-w-4xl">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#B69A68] font-semibold block mb-1">
                    Kenya Destination Transit Guide
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-light mb-2">
                    Comprehensive Coastal, Island, City & Wilderness Access
                  </h3>
                  <p className="text-xs text-[#D9D0C2] leading-relaxed font-light mb-4">
                    Traverse from Nairobi to the Indian Ocean coast via the <strong>Madaraka Express SGR passenger train</strong> in 4.5 hours; connect seamlessly from Mombasa Terminus directly to <strong>Diani Beach</strong> via private road transfer; access <strong>Watamu & Malindi</strong> marine reserves; or embark on a traditional dhow into the car-free archipelago of <strong>Lamu Island</strong>. For wildlife, choose between direct fly-in safari bush planes from Wilson Airport or custom 4x4 Land Cruisers descending the Great Rift Valley into <strong>Maasai Mara</strong>, <strong>Amboseli</strong>, and <strong>Tsavo</strong>.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] uppercase font-semibold text-[#B69A68]">
                    <span className="bg-white/10 px-2.5 py-1">SGR Passenger Rail</span>
                    <span className="bg-white/10 px-2.5 py-1">Lamu Dhow Transfers</span>
                    <span className="bg-white/10 px-2.5 py-1">Diani Beach Road Corridors</span>
                    <span className="bg-white/10 px-2.5 py-1">Wilson Bush Flights</span>
                    <span className="bg-white/10 px-2.5 py-1">Custom 4x4 Cruisers</span>
                  </div>
                </div>
              </div>
            )}

            {/* Routes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoutes.map((route) => (
                <div 
                  key={route.id}
                  className="bg-white border border-[#D9D0C2] p-6 flex flex-col justify-between hover-lift shadow-sm relative group"
                >
                  <div>
                    {/* Header: Type and Route Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-[#78634B] font-medium">
                        {getTransportIcon(route.transportType)}
                        <span className="uppercase tracking-wider text-[10px]">{route.transportType}</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#F7F4ED] border border-[#D9D0C2] text-[#20221F] font-semibold">
                        {route.routeType.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Origin to Destination */}
                    <h3 className="font-serif text-xl text-[#20221F] font-normal mb-2 leading-snug">
                      {route.origin} <span className="text-[#B69A68] mx-1">→</span> {route.destination}
                    </h3>

                    {/* Operator & Duration */}
                    <div className="space-y-1 text-xs text-[#20221F]/70 mb-4 pb-3 border-b border-[#D9D0C2]/50 font-light">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#20221F]">Operator:</span>
                        <span>{route.operatorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#B69A68]" />
                        <span>{route.typicalDuration}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#20221F]/80 leading-relaxed font-light mb-4 line-clamp-3">
                      {route.description}
                    </p>

                    {/* Cross-border requirements or recommended */}
                    {route.crossBorderRequirements && route.crossBorderRequirements.length > 0 && (
                      <div className="p-3 bg-[#F7F4ED] border border-[#D9D0C2]/60 mb-4 text-[11px] space-y-1">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[#78634B] block mb-1">
                          Cross-Border Requirements
                        </span>
                        {route.crossBorderRequirements.slice(0, 2).map((req, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[#20221F]/70">
                            <Check className="w-3 h-3 text-[#B69A68] shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Private Quotation Callout */}
                  <div className="pt-4 border-t border-[#D9D0C2] flex items-center justify-between gap-3 text-xs">
                    <span className="text-[10px] text-[#78634B] font-medium tracking-wide">
                      Private Quotation
                    </span>
                    <button
                      onClick={() => handleOpenInquiryForRoute(route)}
                      className="px-3.5 py-2 bg-[#20221F] hover:bg-[#B69A68] text-white hover:text-[#20221F] text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Plan This Route</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredRoutes.length === 0 && (
              <div className="py-16 text-center max-w-md mx-auto">
                <Compass className="w-10 h-10 text-[#78634B]/40 mx-auto mb-3" />
                <h3 className="font-serif text-xl text-[#20221F] mb-2">No Verified Routes Found</h3>
                <p className="text-xs text-[#20221F]/60 mb-6">
                  We are continuously expanding our verified operator network. You can submit a custom inquiry for any route across East Africa.
                </p>
                <button
                  onClick={() => {
                    setModalMode('transport_only');
                    setIsModalOpen(true);
                  }}
                  className="px-6 py-2.5 bg-[#20221F] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Request Custom Journey
                </button>
              </div>
            )}
          </>
        )}

        {/* 5. VERIFIED OPERATORS DIRECTORY */}
        <div className="mt-20 pt-16 border-t border-[#D9D0C2]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#78634B] font-semibold block mb-1">
                Authorized Carrier Registry
              </span>
              <h3 className="font-serif text-2xl font-light text-[#20221F]">
                Verified Transport Operators
              </h3>
              <p className="text-xs text-[#20221F]/60 mt-1 font-light">
                Independently audited carriers operating across Uganda, Kenya, Tanzania, and Rwanda.
              </p>
            </div>
            <span className="text-xs text-[#78634B] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#B69A68]" />
              <span>Zero Unverified Listings</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operators.map(op => (
              <div key={op.id} className="bg-white border border-[#D9D0C2] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">
                      {op.transportType}
                    </span>
                    <span className="text-[9px] uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                      Verified Carrier
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#20221F] mb-1">{op.name}</h4>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {op.countries.map(c => (
                      <span key={c} className="text-[9px] uppercase px-1.5 py-0.5 bg-[#F7F4ED] text-[#20221F]/70 border border-[#D9D0C2]/50">
                        {c}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-[#20221F]/70 font-light leading-relaxed mb-4">
                    {op.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D9D0C2]/50 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#20221F]/50">Checked: {op.lastChecked}</span>
                  {op.websiteUrl ? (
                    <a
                      href={op.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#78634B] hover:text-[#20221F] font-medium"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[10px] text-[#78634B] font-medium">Arranged by MOS MOS</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. OFFICE LOCATIONS & DIRECT DISPATCH (SECTION 10 OF MASTER PROMPT) */}
        <div className="mt-20 pt-16 border-t border-[#D9D0C2]">
          <div className="bg-[#20221F] text-[#F7F4ED] p-8 sm:p-12 border border-[#343C32]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B69A68] font-semibold block mb-2">
                  Direct Field Desks & Inquiries
                </span>
                <h3 className="font-serif text-3xl font-light mb-4">
                  Speak Directly With Our Expedition Directors
                </h3>
                <p className="text-xs sm:text-sm text-[#D9D0C2] font-light leading-relaxed mb-6">
                  Whether you are coordinating an intercity coach across the Busia border, chartering a private bush flight to Maasai Mara, or reserving hotel suites along Diani Beach, our regional operations offices provide direct, responsive support.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
                  <div className="p-4 bg-white/5 border border-white/10">
                    <span className="text-[11px] font-semibold text-[#B69A68] block mb-1">Uganda Office</span>
                    <p className="text-[#D9D0C2]">Gaba Road, next to Kampala International University, Kampala, Uganda</p>
                    <a href="tel:+256782844193" className="text-white hover:text-[#B69A68] mt-2 block font-medium">
                      +256 782 844 193
                    </a>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10">
                    <span className="text-[11px] font-semibold text-[#B69A68] block mb-1">Kenya Office</span>
                    <p className="text-[#D9D0C2]">Mamboleo, Kisumu, Kenya</p>
                    <a href="tel:+254798277447" className="text-white hover:text-[#B69A68] mt-2 block font-medium">
                      +254 798 277 447
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center gap-4">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] text-[#B69A68] uppercase tracking-wider block font-semibold">
                    Direct Field Emergency & WhatsApp
                  </span>
                  <a href="https://wa.me/256792397899" target="_blank" rel="noopener noreferrer" className="text-lg font-serif text-white hover:text-[#B69A68] transition-colors underline decoration-[#B69A68]/40">
                    +256 792 397 899
                  </a>
                  <span className="text-xs text-[#D9D0C2]/60 block mt-1">24/7 Continuous Transit Support</span>
                </div>
                <button
                  onClick={() => {
                    setModalMode('transport_only');
                    setIsModalOpen(true);
                  }}
                  className="px-8 py-3.5 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Request Travel Arrangement
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 7. PRIVATE TRAVEL INQUIRY MODAL (NO PUBLIC PRICES) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white border border-[#D9D0C2] my-8 shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSubmittedRef(null);
                setFormError(null);
              }}
              className="absolute top-5 right-5 text-[#20221F]/60 hover:text-[#20221F] p-1.5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedRef ? (
              <div className="text-center py-10 animate-letter-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#78634B] font-semibold block mb-1">
                  Inquiry Successfully Received
                </span>
                <h3 className="font-serif text-3xl font-light text-[#20221F] mb-3">
                  Your Journey Reference:
                </h3>
                <span className="font-mono text-xl px-5 py-2.5 bg-[#F7F4ED] border border-[#D9D0C2] text-[#20221F] font-bold tracking-wider inline-block mb-6">
                  {submittedRef}
                </span>

                <div className="bg-[#F7F4ED]/60 border border-[#D9D0C2] p-6 max-w-xl mx-auto text-xs text-[#20221F]/80 leading-relaxed font-light mb-8 text-left space-y-2">
                  <p>
                    ✓ <strong>Private Quotation Review:</strong> Our East African transportation and reservations team has received your travel arrangement request.
                  </p>
                  <p>
                    ✓ <strong>Direct Communication:</strong> We will prepare a personalized itinerary with private pricing tailored to your confidential budget and dispatch it directly to <strong>{formData.customerEmail}</strong>.
                  </p>
                  <p>
                    ✓ <strong>No Pre-Payment Required:</strong> No automatic charges or ticket commitments have been made. Arrangements are finalized only upon your explicit approval.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSubmittedRef(null);
                  }}
                  className="px-8 py-3 bg-[#20221F] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#343C32] transition-colors"
                >
                  Return to Travel Hub
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6 pb-4 border-b border-[#D9D0C2]">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#78634B] font-semibold block mb-1">
                    Bespoke Arrangements & Private Quotation
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#20221F]">
                    {modalMode === 'custom_trip' ? 'Plan a Customized Journey' :
                     modalMode === 'hotel_arrangement' ? 'Hotel & Accommodation Inquiry' :
                     'Request Transportation Arrangement'}
                  </h3>
                  <p className="text-xs text-[#20221F]/60 mt-1 font-light">
                    Submit your itinerary requirements and confidential budget. Our expedition directors will compile a private quotation tailored to your group.
                  </p>
                </div>

                {formError && (
                  <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitInquiry} className="space-y-6">
                  {/* Mode Selector */}
                  <div className="flex flex-wrap gap-2 pb-2">
                    {[
                      { id: 'transport_only', label: 'Transportation Only' },
                      { id: 'custom_trip', label: 'Customized Trip + Hotel' },
                      { id: 'hotel_arrangement', label: 'Accommodation Focused' },
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setModalMode(m.id as any);
                          if (m.id === 'custom_trip' || m.id === 'hotel_arrangement') {
                            setFormData(prev => ({ ...prev, accommodationRequired: true }));
                          }
                        }}
                        className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                          modalMode === m.id
                            ? 'bg-[#20221F] text-white border-[#20221F]'
                            : 'bg-white text-[#78634B] border-[#D9D0C2] hover:bg-[#F7F4ED]'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Section A: Journey Details */}
                  <div className="p-4 bg-[#F7F4ED]/50 border border-[#D9D0C2] space-y-4">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#78634B] block">
                      A. Journey Origin & Destination
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Departure Country
                        </label>
                        <select
                          value={formData.departureCountry}
                          onChange={(e) => setFormData({ ...formData, departureCountry: e.target.value })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                        >
                          {COUNTRY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Departure City or Location
                        </label>
                        <input
                          type="text"
                          required
                          list="departure-cities"
                          placeholder="e.g. Kampala, Entebbe Airport..."
                          value={formData.departureCity}
                          onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                        />
                        <datalist id="departure-cities">
                          {(PREDEFINED_LOCATIONS[formData.departureCountry] || []).map(city => (
                            <option key={city} value={city} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Destination Country
                        </label>
                        <select
                          value={formData.destinationCountry}
                          onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                        >
                          {COUNTRY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Destination City or Park
                        </label>
                        <input
                          type="text"
                          required
                          list="destination-cities"
                          placeholder="e.g. Nairobi, Diani Beach, Maasai Mara..."
                          value={formData.destinationCity}
                          onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                        />
                        <datalist id="destination-cities">
                          {(PREDEFINED_LOCATIONS[formData.destinationCountry] || []).map(city => (
                            <option key={city} value={city} />
                          ))}
                        </datalist>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Departure Date
                        </label>
                        <input
                          type="date"
                          value={formData.departureDate}
                          onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Journey Type
                        </label>
                        <select
                          value={formData.isReturnJourney ? 'return' : 'oneway'}
                          onChange={(e) => setFormData({ ...formData, isReturnJourney: e.target.value === 'return' })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                        >
                          <option value="oneway">One-Way Journey</option>
                          <option value="return">Round-Trip Journey</option>
                        </select>
                      </div>

                      {formData.isReturnJourney && (
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                            Return Date
                          </label>
                          <input
                            type="date"
                            value={formData.returnDate}
                            onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                            className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Total Travelers
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={formData.travelersCount}
                          onChange={(e) => setFormData({ ...formData, travelersCount: Number(e.target.value), adultsCount: Number(e.target.value) })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Adults
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={formData.adultsCount}
                          onChange={(e) => setFormData({ ...formData, adultsCount: Number(e.target.value) })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Children
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={formData.childrenCount}
                          onChange={(e) => setFormData({ ...formData, childrenCount: Number(e.target.value) })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F]"
                        />
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={formData.flexibleDates}
                            onChange={(e) => setFormData({ ...formData, flexibleDates: e.target.checked })}
                            className="rounded border-[#D9D0C2] text-[#B69A68] focus:ring-0"
                          />
                          <span>Dates Flexible</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Section B: Preferred Transportation Modes */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#78634B] font-bold mb-2">
                      B. Preferred Transportation Modes (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'safari_cruiser', label: 'Custom 4x4 Cruiser' },
                        { id: 'train', label: 'SGR Passenger Rail' },
                        { id: 'domestic_flight', label: 'Safari Bush Flight' },
                        { id: 'bus', label: 'Executive Bus' },
                        { id: 'private_driver', label: 'Private Chauffeur' },
                        { id: 'tourist_van', label: 'Tourist Van' },
                        { id: 'ferry_boat', label: 'Ferry or Dhow Boat' },
                        { id: 'no_preference', label: 'Recommend Best' },
                      ].map(mode => {
                        const isSelected = formData.preferredTransportModes.includes(mode.id);
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => {
                                const modes = isSelected
                                  ? prev.preferredTransportModes.filter(m => m !== mode.id)
                                  : [...prev.preferredTransportModes, mode.id];
                                return { ...prev, preferredTransportModes: modes };
                              });
                            }}
                            className={`p-2 text-left border text-[11px] font-medium transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#20221F] text-white border-[#20221F]'
                                : 'bg-white text-[#20221F]/80 border-[#D9D0C2] hover:bg-[#F7F4ED]'
                            }`}
                          >
                            <span>{mode.label}</span>
                            {isSelected && <Check className="w-3 h-3 text-[#B69A68]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section C: Accommodation Arrangements (Optional) */}
                  <div className="p-4 bg-white border border-[#D9D0C2]">
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-[#20221F]">
                        <input
                          type="checkbox"
                          checked={formData.accommodationRequired}
                          onChange={(e) => setFormData({ ...formData, accommodationRequired: e.target.checked })}
                          className="rounded border-[#D9D0C2] text-[#B69A68] focus:ring-0"
                        />
                        <span>Include Hotel & Accommodation Arrangements</span>
                      </label>
                      <span className="text-[10px] text-[#78634B] uppercase tracking-wider font-semibold">
                        Uganda · Kenya · Tanzania · Rwanda
                      </span>
                    </div>

                    {formData.accommodationRequired && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-[#D9D0C2]/50">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                            Preferred Hotel Category
                          </label>
                          <select
                            value={formData.hotelCategory}
                            onChange={(e) => setFormData({ ...formData, hotelCategory: e.target.value as any })}
                            className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F]"
                          >
                            <option value="recommend-for-me">Recommend Best for My Budget</option>
                            <option value="safari-lodge">Luxury Safari Lodge / Tented Camp</option>
                            <option value="beach-resort">Beach Resort (Diani, Watamu, Zanzibar)</option>
                            <option value="luxury-hotel">5-Star Luxury City Hotel</option>
                            <option value="comfortable-midrange">Comfortable Mid-Range Hotel</option>
                            <option value="family-apartment">Family Suite / Private Villa</option>
                            <option value="budget">Clean Budget Accommodation</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                            Number of Rooms Required
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.roomCount}
                            onChange={(e) => setFormData({ ...formData, roomCount: Number(e.target.value) })}
                            className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section D: Confidential Private Budget */}
                  <div className="p-4 bg-[#20221F] text-[#F7F4ED] border border-[#343C32] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-[#B69A68]" />
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#B69A68]">
                          D. Private Budget Information (Confidential)
                        </span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider bg-white/10 px-2 py-0.5 text-[#D9D0C2]">
                        Never Shared Publicly
                      </span>
                    </div>
                    <p className="text-[11px] text-[#D9D0C2]/80 font-light">
                      Your budget allows our directors to recommend realistic options. This data is protected and accessible only to authorized administrators preparing your quotation.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#D9D0C2] font-semibold mb-1">
                          Estimated Budget
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 500, 1500, 3000..."
                          value={formData.estimatedBudget}
                          onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                          className="w-full bg-[#2A2E28] border border-white/20 text-[#F7F4ED] px-3 py-2 text-xs focus:outline-none focus:border-[#B69A68]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#D9D0C2] font-semibold mb-1">
                          Currency
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                          className="w-full bg-[#2A2E28] border border-white/20 text-[#F7F4ED] px-3 py-2 text-xs focus:outline-none focus:border-[#B69A68]"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="KES">KES (Kenyan Shilling)</option>
                          <option value="UGX">UGX (Uganda Shilling)</option>
                          <option value="TZS">TZS (Tanzania Shilling)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#D9D0C2] font-semibold mb-1">
                          Budget Coverage
                        </label>
                        <select
                          value={formData.budgetType}
                          onChange={(e) => setFormData({ ...formData, budgetType: e.target.value as any })}
                          className="w-full bg-[#2A2E28] border border-white/20 text-[#F7F4ED] px-3 py-2 text-xs focus:outline-none focus:border-[#B69A68]"
                        >
                          <option value="group_total">Total for Entire Group</option>
                          <option value="per_person">Per Person</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-[#D9D0C2]">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.budgetIncludesTransport}
                          onChange={(e) => setFormData({ ...formData, budgetIncludesTransport: e.target.checked })}
                          className="rounded border-white/20 text-[#B69A68] focus:ring-0"
                        />
                        <span>Includes Transport</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.budgetIncludesAccommodation}
                          onChange={(e) => setFormData({ ...formData, budgetIncludesAccommodation: e.target.checked })}
                          className="rounded border-white/20 text-[#B69A68] focus:ring-0"
                        />
                        <span>Includes Accommodation</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.budgetIncludesActivities}
                          onChange={(e) => setFormData({ ...formData, budgetIncludesActivities: e.target.checked })}
                          className="rounded border-white/20 text-[#B69A68] focus:ring-0"
                        />
                        <span>Includes Activities</span>
                      </label>
                    </div>
                  </div>

                  {/* Section E: Contact Details */}
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#78634B] block">
                      E. Your Contact Details (No Registration Required)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Eleanor Vance"
                          value={formData.customerName}
                          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. eleanor@example.com"
                          value={formData.customerEmail}
                          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +44 7700 900077"
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Country of Residence
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. United Kingdom, USA, Kenya..."
                          value={formData.countryOfResidence}
                          onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                          Preferred Contact Method
                        </label>
                        <select
                          value={formData.preferredContactMethod}
                          onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value as any })}
                          className="w-full bg-white border border-[#D9D0C2] px-3 py-2 text-xs text-[#20221F]"
                        >
                          <option value="email">Email Response</option>
                          <option value="whatsapp">WhatsApp Direct</option>
                          <option value="phone">Phone Call</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                        Specific Wishes, Luggage Details or Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Extra camera equipment luggage, preference for window seats on the SGR, desire to stop at Lake Naivasha on the way to the Mara..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-white border border-[#D9D0C2] p-3 text-xs text-[#20221F] focus:outline-none focus:border-[#B69A68]"
                      />
                    </div>
                  </div>

                  {/* Submission Action */}
                  <div className="pt-4 border-t border-[#D9D0C2] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[11px] text-[#20221F]/60">
                      ✓ Free personalized review · No pre-charges · Response within 24 hours
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      {isSubmitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Request My Travel Arrangement</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
