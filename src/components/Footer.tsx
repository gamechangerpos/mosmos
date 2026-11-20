import React, { useState } from 'react';
import { ArrowRight, Compass, ShieldCheck, Mail, MapPin, Phone, CheckCircle } from 'lucide-react';
import { MarketingService } from '../services/marketingService';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [trackRef, setTrackRef] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackRef.trim()) {
      onNavigate(`/booking/${trackRef.trim().toUpperCase()}`);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      await MarketingService.subscribe(newsletterEmail.trim(), undefined, ['Wildlife Safaris', 'Savanna Dispatch']);
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#0f0f0f] text-[#D9D0C2]">
      {/* Top Ornamental Separator */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-[#B69A68]/30 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-16 pb-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <button
              onClick={() => onNavigate('/')}
              className="text-left flex flex-col mb-5 group"
            >
              <span className="font-serif text-3xl font-light tracking-[0.2em] uppercase text-[#f6f6f6] group-hover:text-[#B69A68] transition-colors">
                MOS MOS
              </span>
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#B69A68] font-semibold -mt-1">
                Safaris
              </span>
            </button>
            <p className="text-sm text-[#D9D0C2]/70 leading-relaxed max-w-sm mb-8 font-light">
              Crafting extraordinary African safaris, primate expeditions, and bespoke global journeys. Rooted in East Africa with deep respect for wildlife, conservation, and discerning travelers.
            </p>

            {/* Reference Tracker — Virgin LE clean input style */}
            <div className="bg-white/5 p-5 border border-white/8 max-w-sm">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B69A68] font-semibold block mb-1.5">
                Track Booking or Trip Inquiry
              </span>
              <p className="text-xs text-[#D9D0C2]/60 mb-3 font-light">
                Enter your reference code (e.g.{' '}
                <button type="button" onClick={() => setTrackRef('MMS-2026-7841')} className="underline hover:text-white transition-colors">
                  MMS-2026-7841
                </button>
                ) to check live status.
              </p>
              <form onSubmit={handleTrackSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="MMS-2026-XXXX"
                  value={trackRef}
                  onChange={(e) => setTrackRef(e.target.value)}
                  className="bg-[#0f0f0f] border border-white/12 text-[#f6f6f6] text-xs px-3 py-2.5 flex-1 focus:outline-none focus:border-[#B69A68] uppercase font-mono tracking-wider transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#B69A68] hover:bg-[#a68a58] text-[#0f0f0f] text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Track
                </button>
              </form>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f6f6f6] mb-5">
              Destinations
            </h4>
            <ul className="space-y-2.5 text-xs font-light">
              {[
                { name: 'Uganda', slug: 'uganda' },
                { name: 'Tanzania', slug: 'tanzania' },
                { name: 'Rwanda', slug: 'rwanda' },
                { name: 'Kenya', slug: 'kenya' },
                { name: 'South Africa', slug: 'south-africa' },
                { name: 'Dubai', slug: 'dubai' },
                { name: 'Thailand', slug: 'thailand' },
                { name: 'Bali', slug: 'bali' },
                { name: 'Ethiopia', slug: 'ethiopia' },
                { name: 'Egypt', slug: 'egypt' },
              ].map((dest) => (
                <li key={dest.slug}>
                  <button
                    onClick={() => onNavigate(`/destinations/${dest.slug}`)}
                    className="text-[#D9D0C2]/70 hover:text-[#B69A68] transition-colors text-left"
                  >
                    {dest.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Travel Services */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f6f6f6] mb-5">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <button onClick={() => onNavigate('/safari-tours')} className="text-[#D9D0C2]/70 hover:text-[#B69A68] transition-colors">
                  Safari Tours
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/stays')} className="text-[#D9D0C2]/70 hover:text-[#B69A68] transition-colors">
                  Lodges & Camps
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/travel-packages')} className="text-[#D9D0C2]/70 hover:text-[#B69A68] transition-colors">
                  Curated Packages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/transportation')} className="text-[#D9D0C2]/70 hover:text-[#B69A68] transition-colors">
                  Transportation & Travel
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/gallery')} className="text-[#D9D0C2]/70 hover:text-[#B69A68] transition-colors">
                  Photo Gallery & Stories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/flights')} className="text-[#D9D0C2]/70 hover:text-[#B69A68] transition-colors">
                  Flight Concierge
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/plan-trip')} className="text-[#D9D0C2]/70 hover:text-[#B69A68] transition-colors">
                  Custom Trip Planner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/travel-guides')} className="text-[#D9D0C2]/70 hover:text-[#B69A68] transition-colors">
                  Travel Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="text-[#D9D0C2]/70 hover:text-[#B69A68] transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="text-[#D9D0C2]/70 hover:text-[#B69A68] transition-colors">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="text-[#D9D0C2]/70 hover:text-[#B69A68] transition-colors">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f6f6f6] mb-5">
              Savanna Dispatch
            </h4>
            <p className="text-xs text-[#D9D0C2]/60 leading-relaxed font-light mb-4">
              Subscribe for seasonal wildlife migration updates, gorilla permit alerts, and private expedition previews.
            </p>

            {newsletterSubscribed ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>You are subscribed to our private safari dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-xs text-[#f6f6f6] px-3 py-2.5 focus:outline-none focus:border-[#B69A68] transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#B69A68] hover:bg-[#a68a58] text-[#0f0f0f] text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
                >
                  Join Dispatch
                </button>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-white/8 text-xs space-y-2.5 text-[#D9D0C2]/70 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B69A68] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-medium text-white block">Uganda Office:</span>
                  <span>Gaba Road, next to Kampala International University, Kampala, Uganda</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B69A68] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-medium text-white block">Kenya Office:</span>
                  <span>Mamboleo, Kisumu, Kenya</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px]">
                <Phone className="w-3.5 h-3.5 text-[#B69A68] shrink-0" />
                <a href="tel:+256782844193" className="hover:text-[#B69A68] transition-colors">
                  UG: +256 782 844 193
                </a>
                <span className="text-white/20">|</span>
                <a href="tel:+254798277447" className="hover:text-[#B69A68] transition-colors">
                  KE: +254 798 277 447
                </a>
                <span className="text-white/20">|</span>
                <a href="https://wa.me/256792397899" target="_blank" rel="noopener noreferrer" className="hover:text-[#B69A68] transition-colors underline decoration-[#B69A68]/40">
                  WhatsApp: +256 792 397 899
                </a>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <Mail className="w-3.5 h-3.5 text-[#B69A68] shrink-0" />
                <span>inquiries@mosmossafaris.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#D9D0C2]/40 gap-4 font-light">
          <p>© {new Date().getFullYear()} MOS MOS Safaris. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-[#B69A68] transition-colors">
              Privacy Policy
            </button>
            <span className="text-[#D9D0C2]/20">·</span>
            <button onClick={() => onNavigate('/terms')} className="hover:text-[#B69A68] transition-colors">
              Terms of Booking
            </button>
            <span className="text-[#D9D0C2]/20">·</span>
            <button onClick={() => onNavigate('/cancellation-policy')} className="hover:text-[#B69A68] transition-colors">
              Cancellation & Permits
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
