import React, { useState } from 'react';
import { ACCOMMODATIONS } from '../data/staysData';
import { StorageService } from '../services/storageService';
import { ArrowLeft, MapPin, CheckCircle2, Clock, Users, BedDouble, Send, Check } from 'lucide-react';
import { ScrollReveal, MaskedTextReveal, ParallaxImage, VirginCurtainReveal } from '../components/animations/ScrollReveal';

interface StayDetailPageProps {
  slug: string;
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
};

export const StayDetailPage: React.FC<StayDetailPageProps> = ({ slug, onNavigate }) => {
  const stay = ACCOMMODATIONS.find(s => s.slug === slug) || ACCOMMODATIONS[0];
  const brandColor = BRAND_COLORS[stay.destination] || '#78634B';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    roomType: 'Suite',
    notes: ''
  });
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const record = StorageService.saveTripInquiry({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        preferredContact: 'email',
        destinations: [stay.destination],
        travelDates: `${formData.checkIn || 'TBD'} to ${formData.checkOut || 'TBD'}`,
        adultsCount: Number(formData.guests),
        childrenCount: 0,
        budgetRange: stay.indicativePricePerNight ? `$${stay.indicativePricePerNight}/night` : 'Inquire',
        travelStyle: `Accommodation: ${stay.name}`,
        preferredExperiences: ['Luxury Lodge Stay', 'Wildlife Activities'],
        accommodationType: stay.type,
        notes: `Stay Booking Request for ${stay.name}. Room Preference: ${formData.roomType}. Special Requests: ${formData.notes}`
      });

      setSubmittedRef(record.reference);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="pt-20 pb-24 bg-[#F7F4ED] overflow-x-hidden">
      {/* Hero Header — Full bleed with Virgin LE editorial gradient */}
      <div className="relative h-[70vh] min-h-[500px] bg-[#0f0f0f] overflow-hidden">
        <img
          src={stay.heroImage}
          alt={stay.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/40" />
        
        {/* Back navigation */}
        <div className="absolute top-8 left-0 right-0 z-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <button
            onClick={() => onNavigate('/stays')}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-white/80 hover:text-white transition-colors cursor-pointer bg-black/40 backdrop-blur-md px-4 py-2 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Accommodations</span>
          </button>
        </div>

        {/* Bottom Hero Content */}
        <div className="absolute inset-x-0 bottom-0 z-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-12 sm:pb-16">
          <span
            className="text-[10px] uppercase tracking-[0.35em] font-semibold px-3 py-1 bg-black/60 backdrop-blur-sm border border-white/10 inline-block mb-3"
            style={{ color: brandColor }}
          >
            {stay.type} · {stay.destination}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl font-light text-white mb-3 leading-[1.0]">
            {stay.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#D9D0C2] flex items-center gap-2 font-light">
            <MapPin className="w-4 h-4" style={{ color: brandColor }} />
            <span>{stay.location}</span>
          </p>
        </div>
      </div>

      {/* Facts Bar */}
      <div className="bg-[#0f0f0f] text-[#F7F4ED] border-b border-white/10 py-5 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          <div>
            <span className="text-[10px] text-[#D9D0C2]/50 uppercase tracking-wider block">Check-in</span>
            <span className="font-light text-[#F7F4ED]">{stay.checkInTime}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#D9D0C2]/50 uppercase tracking-wider block">Check-out</span>
            <span className="font-light text-[#F7F4ED]">{stay.checkOutTime}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#D9D0C2]/50 uppercase tracking-wider block">Capacity</span>
            <span className="font-light text-[#F7F4ED]">{stay.capacityNote}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#D9D0C2]/50 uppercase tracking-wider block">Indicative Rate</span>
            <span className="font-serif text-base font-semibold text-[#B69A68]">
              ${stay.indicativePricePerNight} <span className="text-xs font-normal text-white/50">/ night</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Details & Amenities — 7 cols */}
          <div className="lg:col-span-7">
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-semibold block mb-2"
              style={{ color: brandColor }}
            >
              Property Narrative
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#20221F] mb-6">
              About {stay.name}
            </h2>
            <p className="text-sm sm:text-base text-[#20221F]/75 font-light leading-relaxed mb-10">
              {stay.description}
            </p>

            {/* Photo Gallery with Virgin LE Curtain Reveal */}
            {stay.gallery && stay.gallery.length > 0 && (
              <div className="mb-12 pt-8 border-t border-[#D9D0C2]">
                <h3 className="font-serif text-2xl font-light text-[#20221F] mb-6">
                  Property Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stay.gallery.map((imgUrl, i) => (
                    <div key={i} className="relative h-56 sm:h-64 overflow-hidden group bg-[#20221F]">
                      <img
                        src={imgUrl}
                        alt={`${stay.name} gallery ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signature Amenities */}
            <div className="pt-8 border-t border-[#D9D0C2]">
              <h3 className="font-serif text-2xl font-light text-[#20221F] mb-6">
                Signature Amenities & Inclusions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stay.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-4 border border-[#D9D0C2]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: brandColor }} />
                    <span className="text-xs text-[#20221F]/80 font-light leading-relaxed">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate Inclusions Note */}
            {stay.priceNote && (
              <div className="mt-8 p-5 bg-[#0f0f0f] text-[#D9D0C2] text-xs font-light border border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-[#B69A68] font-semibold block mb-1">
                  Rate Information:
                </span>
                <p>{stay.priceNote}</p>
              </div>
            )}
          </div>

          {/* Right Column: Inquiry / Reservation Box — 5 cols */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white border border-[#D9D0C2] p-8 sm:p-10 shadow-lg relative">
              {/* Floating Badge */}
              <div className="floating-badge" style={{ backgroundColor: brandColor, color: 'white' }}>
                Direct Reservation
              </div>

              <div className="mb-6 pt-2">
                <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Indicative Rate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-light text-[#20221F]">
                    ${stay.indicativePricePerNight}
                  </span>
                  <span className="text-xs text-[#20221F]/60 font-light">/ night</span>
                </div>
              </div>

              {submittedRef ? (
                <div className="p-6 bg-emerald-50 border border-emerald-300 text-emerald-900 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-medium mb-1">Inquiry Submitted</h4>
                  <p className="text-xs text-emerald-800 mb-3 font-light">
                    Your reference code is:
                  </p>
                  <span className="font-mono text-sm font-bold bg-white px-3 py-1 border border-emerald-300 inline-block mb-3">
                    {submittedRef}
                  </span>
                  <p className="text-[11px] text-emerald-700 font-light leading-relaxed">
                    Our luxury reservations team will confirm availability and contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Harrington"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-[#20221F] text-xs focus:outline-none focus:border-[#20221F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="guest@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 text-[#20221F] text-xs focus:outline-none focus:border-[#20221F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                        className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-[#20221F] text-xs focus:outline-none focus:border-[#20221F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                        className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-[#20221F] text-xs focus:outline-none focus:border-[#20221F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                        Guests
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                        className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-[#20221F] text-xs focus:outline-none focus:border-[#20221F]"
                      >
                        {[1, 2, 3, 4, 6, 8, 12].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                        Room Preference
                      </label>
                      <select
                        value={formData.roomType}
                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                        className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-[#20221F] text-xs focus:outline-none focus:border-[#20221F]"
                      >
                        <option value="Suite">Luxury Suite</option>
                        <option value="Tented Villa">Tented Villa</option>
                        <option value="Private Camp Buyout">Exclusive Camp Buyout</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                      Special Requests
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Dietary requirements, private charter, celebrations..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] p-3 text-[#20221F] text-xs focus:outline-none focus:border-[#20221F]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#0f0f0f] hover:bg-[#20221F] text-white text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Request Reservation'}</span>
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
