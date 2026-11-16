import React, { useState } from 'react';
import { useCmsPackages } from '../services/cmsService';
import { StorageService } from '../services/storageService';
import { ReviewListWidget } from '../components/reviews/ReviewListWidget';
import { WishlistButton } from '../components/common/WishlistButton';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Send, Check } from 'lucide-react';

interface PackageDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const PackageDetailPage: React.FC<PackageDetailPageProps> = ({ slug, onNavigate }) => {
  const { packages } = useCmsPackages(true);
  const pkg = packages.find(p => p.slug === slug || p.id === slug) || packages[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    travelers: 2,
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
        destinations: pkg.destinations,
        travelDates: formData.date || 'Flexible',
        durationDays: 10,
        adultsCount: Number(formData.travelers),
        childrenCount: 0,
        budgetRange: pkg.indicativePrice ? `$${pkg.indicativePrice * Number(formData.travelers)}` : 'Standard Package Quote',
        travelStyle: `Package: ${pkg.title}`,
        preferredExperiences: pkg.highlights.slice(0, 3),
        accommodationType: 'Boutique Lodges & Hotels',
        notes: `Inquiry for package "${pkg.title}". Special notes: ${formData.notes}`,
        quotedAmount: pkg.indicativePrice ? pkg.indicativePrice * Number(formData.travelers) : undefined
      });

      setSubmittedRef(record.reference);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="pt-20 pb-24 bg-[#F7F4ED]">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[440px] bg-[#20221F] overflow-hidden">
        <img
          src={pkg.heroImage}
          alt={pkg.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('/travel-packages')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#D9D0C2] hover:text-[#FFFFFF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Travel Packages</span>
            </button>
            <WishlistButton
              item={{
                itemId: pkg.id,
                itemType: 'package',
                slug: pkg.slug,
                title: pkg.title,
                heroImage: pkg.heroImage,
                location: pkg.destinations.join(', '),
                priceNote: `$${pkg.priceFrom?.toLocaleString()} / person`
              }}
              variant="button"
            />
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#B69A68] font-semibold block mb-2">
              {pkg.category} · {pkg.destinations.join(' & ')}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#F7F4ED] mb-3 max-w-4xl">
              {pkg.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#D9D0C2] flex items-center gap-2 font-light">
              <Clock className="w-4 h-4 text-[#B69A68]" />
              <span>{pkg.duration}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7">
            <h2 className="font-serif text-3xl font-light text-[#20221F] mb-4">
              Itinerary Overview
            </h2>
            <p className="text-sm text-[#20221F]/80 font-light leading-relaxed mb-8">
              {pkg.overview}
            </p>

            {/* Highlights */}
            <div className="bg-white p-6 sm:p-8 border border-[#D9D0C2] mb-8">
              <h3 className="font-serif text-2xl font-light text-[#20221F] mb-4">
                Curated Package Highlights
              </h3>
              <ul className="space-y-2.5 text-xs text-[#20221F]/80">
                {pkg.highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#78634B] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inclusions and Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 border border-[#D9D0C2]">
                <h3 className="font-serif text-xl font-light text-[#20221F] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Inclusions</span>
                </h3>
                <ul className="space-y-2 text-xs text-[#20221F]/75 font-light">
                  {pkg.inclusions.map((inc, i) => (
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
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-700 font-bold">✕</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-5">
            <div className="bg-[#20221F] text-[#F7F4ED] p-8 border border-[#343C32] sticky top-28 shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-1">
                Custom Quotation
              </span>
              <h3 className="font-serif text-2xl font-light text-[#F7F4ED] mb-2">
                Request a Quote
              </h3>
              <p className="text-xs text-[#D9D0C2]/80 font-light mb-6">
                Receive confirmed flight schedules, seasonal lodge options, and guaranteed permit dates.
              </p>

              {submittedRef ? (
                <div className="p-6 bg-[#2A2E28] border border-emerald-500/40 text-center animate-letter-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl text-[#F7F4ED] mb-1">
                    Quotation Request Logged
                  </h4>
                  <p className="text-xs text-[#D9D0C2] mb-3 font-light">
                    Your reference number:
                  </p>
                  <span className="font-mono text-sm px-3 py-1 bg-black/50 text-[#B69A68] border border-white/20 uppercase tracking-wider font-bold">
                    {submittedRef}
                  </span>
                  <p className="text-[11px] text-[#D9D0C2]/70 mt-4 leading-relaxed font-light">
                    Our team will compile your day-by-day proposal and email it within 24 hours.
                  </p>
                  <button
                    onClick={() => onNavigate(`/booking/${submittedRef}`)}
                    className="mt-4 px-4 py-2 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors w-full"
                  >
                    View Status
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Henderson"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#2A2E28] border border-white/15 text-xs text-[#F7F4ED] px-3 py-2.5 focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] block mb-1">Email *</label>
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
                      <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] block mb-1">Phone</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#2A2E28] border border-white/15 text-xs text-[#F7F4ED] px-3 py-2.5 focus:outline-none focus:border-[#B69A68]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] block mb-1">Approximate Travel Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-[#2A2E28] border border-white/15 text-xs text-[#F7F4ED] px-3 py-2.5 focus:outline-none focus:border-[#B69A68]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] block mb-1">Travelers Count</label>
                      <input
                        type="number"
                        min="1"
                        max="16"
                        value={formData.travelers}
                        onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
                        className="w-full bg-[#2A2E28] border border-white/15 text-xs text-[#F7F4ED] px-3 py-2.5 focus:outline-none focus:border-[#B69A68]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] block mb-1">Notes / Preferences</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Preferred room type, flight connections, dietary requirements..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-[#2A2E28] border border-white/15 text-xs text-[#F7F4ED] p-3 focus:outline-none focus:border-[#B69A68]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending Request...' : 'Request Quotation'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Customer Reviews & Feedback */}
        <div className="mt-12">
          <ReviewListWidget
            targetType="package"
            targetSlug={pkg.slug}
            targetTitle={pkg.title}
          />
        </div>

      </div>
    </div>
  );
};
