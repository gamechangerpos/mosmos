import React, { useState } from 'react';
import { ACCOMMODATIONS } from '../data/staysData';
import { CinematicVideo } from '../components/common/CinematicVideo';
import { WishlistButton } from '../components/common/WishlistButton';
import { ArrowRight, MapPin } from 'lucide-react';
import { ScrollReveal, MaskedTextReveal, ParallaxImage, VirginCurtainReveal } from '../components/animations/ScrollReveal';

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
};

export const StaysPage: React.FC<StaysPageProps> = ({ onNavigate }) => {
  const [selectedType, setSelectedType] = useState<string>('all');

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
            <p className="text-sm sm:text-base text-[#D9D0C2]/80 font-light max-w-2xl mx-auto leading-relaxed mb-10">
              From Sir Richard Branson’s Mahali Mzuri in the Maasai Mara to the cliffside treehouse suites of Ulusaba and vineyard estates in Franschhoek — explore our collection of iconic wilderness properties.
            </p>
          </ScrollReveal>

          {/* Type Filter Buttons */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="flex flex-wrap justify-center gap-2 pt-6 border-t border-white/10 max-w-3xl mx-auto">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-5 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                    selectedType === t
                      ? 'bg-[#B69A68] text-[#0f0f0f]'
                      : 'bg-white/5 text-[#D9D0C2] hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {t === 'all' ? 'All Accommodations' : t}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Grid of Luxury Stays */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filtered.map((stay, idx) => {
            const brandColor = BRAND_COLORS[stay.destination] || '#78634B';

            return (
              <ScrollReveal key={stay.slug} direction="up" delay={0.1 + (idx % 3) * 0.1}>
                <div
                  onClick={() => onNavigate(`/stays/${stay.slug}`)}
                  className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden flex flex-col hover-lift h-full relative"
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
                          priceNote: stay.indicativePricePerNight ? `$${stay.indicativePricePerNight}/night` : undefined
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
                          Capacity & Intimacy:
                        </span>
                        <span>{stay.capacityNote}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#D9D0C2] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 block">From</span>
                        <span className="font-serif text-lg font-semibold text-[#20221F]">
                          ${stay.indicativePricePerNight} <span className="text-xs font-normal text-[#20221F]/50">/ night</span>
                        </span>
                      </div>
                      <span
                        className="px-4 py-2 bg-[#0f0f0f] text-white text-[11px] uppercase tracking-[0.15em] font-semibold hover:bg-[#78634B] transition-colors"
                      >
                        Check Availability
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
