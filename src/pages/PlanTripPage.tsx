import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { Compass, CheckCircle2, Send, Check, Calendar, Users, DollarSign, Shield } from 'lucide-react';

interface PlanTripPageProps {
  onNavigate: (path: string) => void;
  initialDestination?: string;
}

export const PlanTripPage: React.FC<PlanTripPageProps> = ({ onNavigate, initialDestination }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'email' as 'email' | 'phone' | 'whatsapp',
    destinations: initialDestination ? [initialDestination] : ['Uganda'],
    travelDates: '',
    durationDays: 10,
    adults: 2,
    children: 0,
    budgetRange: '$4,000 – $6,000 per person',
    travelStyle: 'Luxury Safari & Private Land Cruiser',
    preferredExperiences: ['Mountain Gorilla Trekking', 'Savanna Game Drives'],
    accommodationType: 'Luxury Tented Camps & Eco-Lodges',
    notes: ''
  });

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const availableDestinations = [
    'Uganda', 'Tanzania', 'Rwanda', 'Kenya', 'South Africa',
    'Dubai', 'Thailand', 'Bali', 'Ethiopia', 'Egypt'
  ];

  const experienceOptions = [
    'Mountain Gorilla Trekking',
    'Chimpanzee Tracking & Habituation',
    'Great Migration River Crossings',
    'Big Five Savanna Game Drives',
    'Wildlife Photography Expeditions',
    'Hot Air Balloon Sunrise Safari',
    'Zanzibar / Coastal Beach Extension',
    'Canopy Walkways & Rainforest Hikes',
    'Cultural Heritage & Ancient Monoliths'
  ];

  const toggleDestination = (dest: string) => {
    if (formData.destinations.includes(dest)) {
      if (formData.destinations.length > 1) {
        setFormData({
          ...formData,
          destinations: formData.destinations.filter(d => d !== dest)
        });
      }
    } else {
      setFormData({
        ...formData,
        destinations: [...formData.destinations, dest]
      });
    }
  };

  const toggleExperience = (exp: string) => {
    if (formData.preferredExperiences.includes(exp)) {
      setFormData({
        ...formData,
        preferredExperiences: formData.preferredExperiences.filter(e => e !== exp)
      });
    } else {
      setFormData({
        ...formData,
        preferredExperiences: [...formData.preferredExperiences, exp]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Honeypot check for spam protection
    if (honeypot) {
      setSubmittedRef(`MMS-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      return;
    }

    // 2. Syntax validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const cleanEmail = formData.email.trim();
    const cleanName = formData.name.trim();

    if (!cleanName) {
      setFormError('Please enter your name.');
      return;
    }

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setFormError('Please provide a valid email address so we can send your custom proposal.');
      return;
    }

    // 3. Client rate-limiting
    const lastSubKey = 'mos_last_planner_timestamp';
    const lastSubTime = Number(sessionStorage.getItem(lastSubKey) || '0');
    const now = Date.now();
    if (now - lastSubTime < 8000) {
      setFormError('Your request is being submitted. Please wait a moment.');
      return;
    }
    sessionStorage.setItem(lastSubKey, String(now));

    setIsSubmitting(true);

    // Try Vercel Serverless Function first for secure server-side email dispatch
    fetch('/api/inquire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        phone: formData.phone.trim() || undefined,
        category: 'Custom Safari Planning',
        destinations: formData.destinations,
        travelDates: formData.travelDates,
        message: `[Trip Planner] Destinations: ${formData.destinations.join(', ')} | Style: ${formData.travelStyle} | Budget: ${formData.budgetRange} | Travelers: ${formData.adults} Adults, ${formData.children} Children | Notes: ${formData.notes}`,
        website_url_hp: honeypot
      })
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.reference) {
            setSubmittedRef(data.reference);
          }
        }
      })
      .catch(() => {
        // Fallback for offline or local preview
      })
      .finally(() => {
        const record = StorageService.saveTripInquiry({
          customerName: cleanName,
          customerEmail: cleanEmail,
          customerPhone: formData.phone.trim() || undefined,
          preferredContact: formData.preferredContact,
          destinations: formData.destinations,
          travelDates: formData.travelDates || 'Flexible 2027',
          durationDays: Number(formData.durationDays),
          adultsCount: Number(formData.adults),
          childrenCount: Number(formData.children),
          budgetRange: formData.budgetRange,
          travelStyle: formData.travelStyle,
          preferredExperiences: formData.preferredExperiences,
          accommodationType: formData.accommodationType,
          notes: formData.notes.trim() || undefined
        });

        setSubmittedRef((prev) => prev || record.reference);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="pt-24 pb-20 bg-[#F7F4ED]">
      {/* Header */}
      <div className="bg-[#20221F] text-[#F7F4ED] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#343C32]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-2">
            Tailor-Made Expeditions
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#F7F4ED] mb-4">
            Custom Safari & Trip Planner
          </h1>
          <p className="text-sm sm:text-base text-[#D9D0C2] font-light max-w-2xl leading-relaxed">
            Tell us about your dream journey. Whether you wish to combine gorilla trekking in Uganda with the great migration in Tanzania or an ancient Nile cruise in Egypt, we design every detail around you.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {submittedRef ? (
          <div className="bg-white p-8 sm:p-12 border border-[#D9D0C2] text-center shadow-xl animate-letter-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase tracking-widest text-[#78634B] font-semibold block mb-1">
              Custom Itinerary Request Logged
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#20221F] mb-3">
              Your Expedition Proposal is Underway
            </h2>
            <p className="text-xs text-[#20221F]/70 mb-4 font-light">
              Your confidential inquiry reference code:
            </p>
            <span className="font-mono text-lg px-4 py-2 bg-[#F7F4ED] text-[#20221F] border border-[#D9D0C2] uppercase tracking-wider font-bold">
              {submittedRef}
            </span>
            <p className="text-xs text-[#20221F]/80 max-w-lg mx-auto mt-6 leading-relaxed font-light">
              Thank you, <strong>{formData.name}</strong>. We have dispatched your multi-country requirements to our senior expedition directors. A personalized day-by-day proposal with lodge allocations and permit availability will be delivered directly to <strong className="text-[#20221F]">{formData.email}</strong> within <strong>two business days</strong>.
            </p>
            <p className="text-[11px] text-[#78634B] mt-2 font-medium">
              No login, OTP, or verification step is needed. Our team will contact you directly by email.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => onNavigate('/')}
                className="px-6 py-2.5 bg-[#20221F] hover:bg-[#78634B] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 border border-[#D9D0C2] shadow-xl space-y-8">
            {formError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}

            {/* Spam Protection Honeypot */}
            <input
              type="text"
              name="website_url_hp"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0, margin: 0 }}
              aria-hidden="true"
            />
            
            {/* Step 1: Destination Selection (Multi-Country Support) */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">Step 1</span>
              <h3 className="font-serif text-2xl font-light text-[#20221F] mb-2">
                Select Destinations (Multi-Country Supported)
              </h3>
              <p className="text-xs text-[#20221F]/70 mb-4 font-light">
                Choose one or more countries to build a combined circuit (e.g. Uganda gorillas + Tanzania migration):
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {availableDestinations.map((dest) => {
                  const selected = formData.destinations.includes(dest);
                  return (
                    <button
                      type="button"
                      key={dest}
                      onClick={() => toggleDestination(dest)}
                      className={`p-3 text-xs font-medium text-left border transition-all ${
                        selected
                          ? 'bg-[#20221F] text-[#F7F4ED] border-[#20221F] shadow-sm'
                          : 'bg-[#F7F4ED] text-[#20221F] border-[#D9D0C2] hover:border-[#78634B]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{dest}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-[#B69A68]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Preferred Wildlife & Experiences */}
            <div className="pt-6 border-t border-[#D9D0C2]">
              <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">Step 2</span>
              <h3 className="font-serif text-2xl font-light text-[#20221F] mb-2">
                Wildlife & Experiences of Interest
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {experienceOptions.map((exp) => {
                  const selected = formData.preferredExperiences.includes(exp);
                  return (
                    <button
                      type="button"
                      key={exp}
                      onClick={() => toggleExperience(exp)}
                      className={`p-3 text-xs text-left border transition-all ${
                        selected
                          ? 'bg-[#EFECE3] border-[#78634B] text-[#20221F] font-semibold'
                          : 'bg-white border-[#D9D0C2] text-[#20221F]/80 hover:border-[#78634B]'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`w-3.5 h-3.5 rounded-sm border shrink-0 mt-0.5 flex items-center justify-center ${
                          selected ? 'bg-[#78634B] border-[#78634B] text-white' : 'border-[#D9D0C2]'
                        }`}>
                          {selected && '✓'}
                        </span>
                        <span className="text-[11px] leading-tight">{exp}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Dates, Duration & Group Details */}
            <div className="pt-6 border-t border-[#D9D0C2]">
              <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">Step 3</span>
              <h3 className="font-serif text-2xl font-light text-[#20221F] mb-4">
                Timing, Party Size & Comfort Class
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
                    Approximate Travel Window
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. July 2027 or Specific Dates"
                    value={formData.travelDates}
                    onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="30"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
                    Adults / Children
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="1"
                      max="16"
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                      placeholder="Adults"
                      className="bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-3 py-3 text-center"
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                      placeholder="Children"
                      className="bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-3 py-3 text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block">
                      Target Budget Range
                    </label>
                    <span className="text-[10px] text-[#78634B] font-medium">Confidential</span>
                  </div>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  >
                    <option value="Private Budget / Discuss with Team">Private Budget / Discuss with Team</option>
                    <option value="Comfortable Mid-Range ($2,500 – $4,000 per person)">Comfortable Mid-Range ($2,500 – $4,000 per person)</option>
                    <option value="Classic Luxury ($4,000 – $6,500 per person)">Classic Luxury ($4,000 – $6,500 per person)</option>
                    <option value="Ultra-Luxury & Private Flights ($7,000+ per person)">Ultra-Luxury & Private Flights ($7,000+ per person)</option>
                    <option value="Custom Budget to be Quoted">Custom Budget to be Quoted</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
                    Lodge Style Preference
                  </label>
                  <select
                    value={formData.accommodationType}
                    onChange={(e) => setFormData({ ...formData, accommodationType: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  >
                    <option value="Luxury Tented Camps & Eco-Lodges">Luxury Tented Camps & Eco-Lodges</option>
                    <option value="Premier 5-Star Safari Lodges (Singita / Wilderness)">Premier 5-Star Safari Lodges</option>
                    <option value="Intimate Boutique Bush Camps">Intimate Boutique Bush Camps</option>
                    <option value="Mix of Classic Safari & Beach Villa">Mix of Classic Safari & Beach Villa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Contact & Guest Details */}
            <div className="pt-6 border-t border-[#D9D0C2]">
              <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">Step 4</span>
              <h3 className="font-serif text-2xl font-light text-[#20221F] mb-4">
                Your Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lord & Lady Sterling"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1">
                  Specific Requests, Celebrations or Accessibility Needs
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Honeymoon celebration, vegetarian food, need private Land Cruiser with 360-degree photography mounts..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] p-4 focus:outline-none focus:border-[#78634B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting Expedition Requirements...' : 'Submit Custom Trip Request & Generate Reference'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
