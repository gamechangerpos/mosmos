import React from 'react';
import { TRAVEL_PACKAGES } from '../data/packagesData';
import { ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { ScrollReveal, MaskedTextReveal, ParallaxImage, VirginCurtainReveal } from '../components/animations/ScrollReveal';

interface PackagesPageProps {
  onNavigate: (path: string) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-24 bg-[#F7F4ED] overflow-x-hidden">
      {/* Hero Header — Virgin LE Dark Editorial Hero */}
      <div className="relative bg-[#0f0f0f] text-[#F7F4ED] py-24 sm:py-32 px-4 sm:px-8 lg:px-12 overflow-hidden">
        <video
          src="/media/videos/Son_Bunyola_Hero_Video.mp4"
          autoPlay
          muted
          playsInline
          loop
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-[#0f0f0f]/80" />

        <div className="relative z-10 max-w-[1440px] mx-auto text-center">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#B69A68] font-sans font-semibold block mb-4">
              Curated Global Itineraries
            </span>
          </ScrollReveal>
          <MaskedTextReveal delay={0.2}>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white mb-6 leading-[1.05]">
              Featured Travel Packages.
            </h1>
          </MaskedTextReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-sm sm:text-base text-[#D9D0C2]/80 font-light max-w-2xl mx-auto leading-relaxed">
              Seamless itineraries uniting private bush flights, master naturalist guides, world-heritage sanctuaries, and legendary boutique retreats.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Packages Grid with Floating Badges & Curtain Reveals */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {TRAVEL_PACKAGES.map((pkg, idx) => (
            <ScrollReveal key={pkg.slug} direction="up" delay={0.1 + (idx % 3) * 0.1}>
              <div
                onClick={() => onNavigate(`/travel-packages/${pkg.slug}`)}
                className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden flex flex-col hover-lift h-full relative"
              >
                {/* Floating Badge */}
                <div className="floating-badge">
                  {pkg.duration}
                </div>

                <div className="relative h-72 sm:h-80 overflow-hidden bg-[#20221F]">
                  <img
                    src={pkg.heroImage}
                    alt={pkg.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-3 py-1 font-semibold">
                    {pkg.destinations.join(' & ')}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#78634B] font-semibold block mb-2">
                      {pkg.category}
                    </span>
                    <h3 className="font-serif text-2xl font-light text-[#20221F] group-hover:text-[#78634B] transition-colors mb-3 leading-snug">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-[#20221F]/70 leading-relaxed font-light mb-6 line-clamp-3">
                      {pkg.overview}
                    </p>

                    <ul className="space-y-2 mb-6 pt-4 border-t border-[#D9D0C2]/40 text-xs text-[#20221F]/80 font-light">
                      {pkg.highlights.slice(0, 3).map((hl, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#78634B] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#D9D0C2] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 block">From</span>
                      <span className="font-serif text-lg font-semibold text-[#20221F]">
                        ${pkg.indicativePrice?.toLocaleString()} <span className="text-xs font-normal text-[#20221F]/50">/ guest</span>
                      </span>
                    </div>
                    <span className="px-4 py-2 bg-[#0f0f0f] text-white text-[11px] uppercase tracking-[0.15em] font-semibold hover:bg-[#78634B] transition-colors">
                      View Package
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};
