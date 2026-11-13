import React, { useState } from 'react';
import { SAFARI_TOURS } from '../data/toursData';
import { CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { ScrollReveal, MaskedTextReveal, ParallaxImage, VirginCurtainReveal } from '../components/animations/ScrollReveal';

interface ToursPageProps {
  onNavigate: (path: string) => void;
}

const BRAND_COLORS: Record<string, string> = {
  Uganda: '#BA5F27',
  Tanzania: '#B83C25',
  Kenya: '#8A8F64',
  Rwanda: '#7C6119',
  'South Africa': '#4A4238',
};

export const ToursPage: React.FC<ToursPageProps> = ({ onNavigate }) => {
  const [selectedDestination, setSelectedDestination] = useState<string>('all');

  const destinations = ['all', 'Uganda', 'Tanzania', 'Kenya', 'Rwanda', 'South Africa'];

  const filteredTours = selectedDestination === 'all'
    ? SAFARI_TOURS
    : SAFARI_TOURS.filter(t => t.destination.toLowerCase() === selectedDestination.toLowerCase());

  return (
    <div className="pt-24 pb-24 bg-[#F7F4ED] overflow-x-hidden">
      {/* Hero Header — Virgin LE Dark Editorial Hero */}
      <div className="relative bg-[#0f0f0f] text-[#F7F4ED] py-24 sm:py-32 px-4 sm:px-8 lg:px-12 overflow-hidden">
        <video
          src="/media/videos/Finch_Hattons_Hero_Video.mp4"
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
              Signature Wildlife Expeditions
            </span>
          </ScrollReveal>
          <MaskedTextReveal delay={0.2}>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white mb-6 leading-[1.05]">
              Curated African Safari Tours.
            </h1>
          </MaskedTextReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-sm sm:text-base text-[#D9D0C2]/80 font-light max-w-2xl mx-auto leading-relaxed mb-10">
              Led by senior naturalist guides in private 4x4 Land Cruisers with guaranteed official national park permits, intimate luxury tented camps, and unhurried wildlife tracking.
            </p>
          </ScrollReveal>

          {/* Destination Filter Tabs */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="flex flex-wrap justify-center gap-2 pt-6 border-t border-white/10 max-w-3xl mx-auto">
              {destinations.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDestination(d)}
                  className={`px-5 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                    selectedDestination === d
                      ? 'bg-[#B69A68] text-[#0f0f0f]'
                      : 'bg-white/5 text-[#D9D0C2] hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {d === 'all' ? 'All Expeditions' : d}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Tours Grid with Virgin LE Floating Badges & Curtain Reveals */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filteredTours.map((tour, idx) => {
            const brandColor = BRAND_COLORS[tour.destination] || '#78634B';

            return (
              <ScrollReveal key={tour.slug} direction="up" delay={0.1 + (idx % 3) * 0.1}>
                <div
                  onClick={() => onNavigate(`/safari-tours/${tour.slug}`)}
                  className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden flex flex-col hover-lift h-full relative"
                >
                  {/* Floating Badge */}
                  <div className="floating-badge">
                    {tour.durationDays} Days
                  </div>

                  <div className="relative h-72 sm:h-80 overflow-hidden bg-[#20221F]">
                    <img
                      src={tour.heroImage}
                      alt={tour.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-3 py-1 font-semibold">
                      {tour.destination}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <span
                        className="text-[10px] uppercase tracking-[0.25em] font-semibold block mb-2"
                        style={{ color: brandColor }}
                      >
                        {tour.destination} · {tour.physicalRating} Level
                      </span>
                      <h3 className="font-serif text-2xl font-light text-[#20221F] group-hover:text-[#78634B] transition-colors mb-3 leading-snug">
                        {tour.title}
                      </h3>
                      <p className="text-xs text-[#20221F]/70 leading-relaxed font-light mb-6 line-clamp-3">
                        {tour.summary}
                      </p>

                      <ul className="space-y-2 mb-6 pt-4 border-t border-[#D9D0C2]/40 text-xs text-[#20221F]/80 font-light">
                        {tour.highlights.slice(0, 3).map((hl, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: brandColor }} />
                            <span className="line-clamp-1">{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-[#D9D0C2] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 block">From</span>
                        <span className="font-serif text-lg font-semibold text-[#20221F]">
                          ${tour.indicativePrice?.toLocaleString()}{' '}
                          <span className="text-xs font-normal text-[#20221F]/50">/ guest</span>
                        </span>
                      </div>
                      <span className="px-4 py-2 bg-[#0f0f0f] text-white text-[11px] uppercase tracking-[0.15em] font-semibold hover:bg-[#78634B] transition-colors">
                        Explore
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
