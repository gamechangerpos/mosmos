import React, { useState } from 'react';
import { SAFARI_TOURS } from '../data/toursData';
import { StorageService } from '../services/storageService';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Users, Shield, Compass, Calendar, Check, Send } from 'lucide-react';

interface TourDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const TourDetailPage: React.FC<TourDetailPageProps> = ({ slug, onNavigate }) => {
  const tour = SAFARI_TOURS.find(t => t.slug === slug) || SAFARI_TOURS[0];

  const [activeDay, setActiveDay] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    travelers: 2,
    specialRequests: ''
  });
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const record = StorageService.saveTourBooking({
        tourId: tour.id,
        tourTitle: tour.title,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        preferredDate: formData.date || 'Flexible 2027',
        travelersCount: Number(formData.travelers),
        specialRequests: formData.specialRequests,
        totalEstimatedPrice: tour.indicativePrice ? tour.indicativePrice * Number(formData.travelers) : undefined
      });

      // Also create general trip inquiry so it is visible in admin tracking
      StorageService.saveTripInquiry({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        preferredContact: 'email',
        destinations: [tour.destination],
        travelDates: formData.date || 'Flexible',
        durationDays: tour.durationDays,
        adultsCount: Number(formData.travelers),
        childrenCount: 0,
        budgetRange: tour.indicativePrice ? `$${tour.indicativePrice * Number(formData.travelers)}` : 'Standard Quote',
        travelStyle: 'Curated Safari Tour',
        preferredExperiences: tour.highlights.slice(0, 3),
        accommodationType: 'Premier Safari Lodges',
        notes: `Inquiry for Tour: "${tour.title}". Notes: ${formData.specialRequests}`
      });

      setSubmittedRef(record.reference);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="pt-20 pb-24 bg-[#F7F4ED]">
      {/* 1. Tour Hero Header */}
      <div className="relative h-[60vh] min-h-[440px] bg-[#20221F] overflow-hidden">
        <img
          src={tour.heroImage}
          alt={tour.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
          <div>
            <button
              onClick={() => onNavigate('/safari-tours')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#D9D0C2] hover:text-[#FFFFFF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Safari Tours</span>
            </button>
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#B69A68] font-semibold block mb-2">
              {tour.destination} · Signature Expedition
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#F7F4ED] mb-3 max-w-4xl">
              {tour.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#D9D0C2] font-light max-w-2xl leading-relaxed mb-4">
              {tour.summary}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Expedition Metrics Bar */}
      <div className="bg-[#20221F] text-[#F7F4ED] border-b border-[#343C32] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#B69A68]" />
            <div>
              <span className="text-[10px] text-[#D9D0C2]/60 uppercase tracking-wider block">Duration</span>
              <span className="font-medium text-[#F7F4ED]">{tour.durationDays} Days / {tour.durationDays - 1} Nights</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-[#B69A68]" />
            <div>
              <span className="text-[10px] text-[#D9D0C2]/60 uppercase tracking-wider block">Group Size</span>
              <span className="font-medium text-[#F7F4ED]">Max {tour.maxGroupSize} Guests (Window Seats)</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-[#B69A68]" />
            <div>
              <span className="text-[10px] text-[#D9D0C2]/60 uppercase tracking-wider block">Activity Level</span>
              <span className="font-medium text-[#F7F4ED]">{tour.physicalRating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-[#B69A68]" />
            <div>
              <span className="text-[10px] text-[#D9D0C2]/60 uppercase tracking-wider block">Indicative Rate</span>
              <span className="font-medium text-[#F7F4ED]">${tour.indicativePrice?.toLocaleString()} / person</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content: Itinerary & Booking Inquiry Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Highlights & Day-by-day Itinerary */}
          <div className="lg:col-span-7">
            {/* Highlights */}
            <div className="mb-10 bg-white p-6 sm:p-8 border border-[#D9D0C2]">
              <h2 className="font-serif text-2xl font-light text-[#20221F] mb-4">
                Expedition Highlights
              </h2>
              <ul className="space-y-2.5 text-xs text-[#20221F]/80">
                {tour.highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#78634B] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Itinerary */}
            <h2 className="font-serif text-3xl font-light text-[#20221F] mb-6">
              Day-by-Day Safari Itinerary
            </h2>

            <div className="space-y-4">
              {tour.itinerary.map((day) => {
                const isOpen = activeDay === day.day;
                return (
                  <div
                    key={day.day}
                    className="bg-white border border-[#D9D0C2] overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveDay(isOpen ? 0 : day.day)}
                      className="w-full p-5 text-left flex items-center justify-between hover:bg-[#F7F4ED] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-serif text-xl font-medium text-[#78634B] w-14 shrink-0">
                          Day {day.day}
                        </span>
                        <span className="font-serif text-lg font-light text-[#20221F]">
                          {day.title}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[#78634B]">
                        {isOpen ? '—' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-6 pt-2 border-t border-[#D9D0C2]/50 text-xs text-[#20221F]/80 leading-relaxed font-light">
                        <p className="mb-4">{day.description}</p>
                        <div className="flex flex-wrap gap-4 text-[11px] pt-3 border-t border-[#D9D0C2]/30 text-[#20221F]/70">
                          {day.accommodation && (
                            <div>
                              <span className="font-semibold text-[#78634B]">Lodge / Camp: </span>
                              <span>{day.accommodation}</span>
                            </div>
                          )}
                          {day.meals && (
                            <div>
                              <span className="font-semibold text-[#78634B]">Meals: </span>
                              <span>{day.meals}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Inclusions and Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              <div className="bg-white p-6 border border-[#D9D0C2]">
                <h3 className="font-serif text-xl font-light text-[#20221F] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Inclusions</span>
                </h3>
                <ul className="space-y-2 text-xs text-[#20221F]/75 font-light">
                  {tour.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 border border-[#D9D0C2]">
                <h3 className="font-serif text-xl font-light text-[#20221F] mb-4 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-700" />
                  <span>Exclusions</span>
                </h3>
                <ul className="space-y-2 text-xs text-[#20221F]/75 font-light">
                  {tour.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-700 font-bold">✕</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Working Inquiry / Reservation Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[#20221F] text-[#F7F4ED] p-8 border border-[#343C32] shadow-2xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-1">
                Direct Reservation Inquiry
              </span>
              <h3 className="font-serif text-2xl font-light text-[#F7F4ED] mb-2">
                Inquire About This Safari
              </h3>
              <p className="text-xs text-[#D9D0C2]/80 font-light mb-6">
                Receive confirmed permit availability, lodge options, and customized quotes from our regional safari director.
              </p>

              {submittedRef ? (
                <div className="p-6 bg-[#2A2E28] border border-emerald-500/40 text-center animate-letter-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl text-[#F7F4ED] mb-1">
                    Booking Request Received
                  </h4>
                  <p className="text-xs text-[#D9D0C2] mb-3 font-light">
                    Your reference code is:
                  </p>
                  <span className="font-mono text-sm px-3 py-1 bg-black/50 text-[#B69A68] border border-white/20 uppercase tracking-wider font-bold">
                    {submittedRef}
                  </span>
                  <p className="text-[11px] text-[#D9D0C2]/80 mt-4 leading-relaxed font-light">
                    Thank you, <strong>{formData.name}</strong>. Our travel team will review your booking details and respond directly to <strong>{formData.email}</strong> within <strong>two business days</strong>. No account creation or verification link is required.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Arthur Pendleton"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#2A2E28] border border-white/15 text-xs text-[#F7F4ED] px-3 py-2.5 focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#2A2E28] border border-white/15 text-xs text-[#F7F4ED] px-3 py-2.5 focus:outline-none focus:border-[#B69A68]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] block mb-1">
                        Telephone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 012-3456"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#2A2E28] border border-white/15 text-xs text-[#F7F4ED] px-3 py-2.5 focus:outline-none focus:border-[#B69A68]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] block mb-1">
                        Preferred Departure Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-[#2A2E28] border border-white/15 text-xs text-[#F7F4ED] px-3 py-2.5 focus:outline-none focus:border-[#B69A68]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] block mb-1">
                        Number of Travelers
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={formData.travelers}
                        onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
                        className="w-full bg-[#2A2E28] border border-white/15 text-xs text-[#F7F4ED] px-3 py-2.5 focus:outline-none focus:border-[#B69A68]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] block mb-1">
                      Special Requirements or Safari Wishes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Focus on big cat photography, dietary preferences, extra day in Bwindi..."
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      className="w-full bg-[#2A2E28] border border-white/15 text-xs text-[#F7F4ED] p-3 focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>

                  <div className="p-3 bg-black/30 border border-white/10 text-[11px] text-[#D9D0C2]/70 leading-relaxed font-light">
                    ✓ Direct permit verification with official wildlife authorities<br />
                    ✓ No automated charges until quote and lodge allocations are approved
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Submitting Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Request Official Quotation</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
