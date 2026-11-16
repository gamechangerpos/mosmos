import React, { useState } from 'react';
import { useCmsDestinations } from '../services/cmsService';
import { ArrowRight, Scale, MapPin } from 'lucide-react';
import { CinematicVideo } from '../components/common/CinematicVideo';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { ScrollReveal, MaskedTextReveal, ParallaxImage, VirginCurtainReveal } from '../components/animations/ScrollReveal';
import { InteractiveTravelMap } from '../components/common/InteractiveTravelMap';
import { DestinationComparisonModal } from '../components/destinations/DestinationComparisonModal';

interface DestinationsPageProps {
  onNavigate: (path: string) => void;
}

const BRAND_COLORS: Record<string, string> = {
  uganda: '#BA5F27',
  tanzania: '#B83C25',
  rwanda: '#7C6119',
  kenya: '#8A8F64',
  'south-africa': '#4A4238',
  dubai: '#00B3D2',
  thailand: '#2CB2A5',
  bali: '#5F7361',
  ethiopia: '#B83C25',
  egypt: '#365D9D',
};

export const DestinationsPage: React.FC<DestinationsPageProps> = ({ onNavigate }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const { destinations } = useCmsDestinations(false);

  const handleSearch = (params: {
    destination: string;
    tripType: string;
    season: string;
    travelers: string;
    budget: string;
  }) => {
    if (params.destination !== 'all') {
      onNavigate(`/destinations/${params.destination}`);
    } else if (params.tripType !== 'all') {
      onNavigate('/safari-tours');
    }
  };

  const regions: { id: string; label: string }[] = [
    { id: 'all', label: 'All Destinations (10)' },
    { id: 'East Africa', label: 'East Africa' },
    { id: 'Southern Africa', label: 'Southern Africa' },
    { id: 'Middle East', label: 'Middle East' },
    { id: 'Asia', label: 'Asia' },
    { id: 'North Africa', label: 'North Africa' }
  ];

  const filtered = selectedRegion === 'all'
    ? destinations
    : destinations.filter(d => d.region === selectedRegion);

  return (
    <div className="pt-24 pb-24 bg-[#F7F4ED] overflow-x-hidden">
      {/* Hero Header — Virgin LE Dark Editorial Hero */}
      <div className="relative bg-[#0f0f0f] text-[#F7F4ED] py-24 sm:py-32 px-4 sm:px-8 lg:px-12 overflow-hidden">
        {/* Subtle background ambient video */}
        <CinematicVideo
          src="/media/videos/Virgin_Limited_Edition_Showreel_Hero_Video.mp4"
          mobileObjectPosition="center 35%"
          desktopObjectPosition="center center"
          priority={true}
          opacityClassName="opacity-25"
          containerClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-[#0f0f0f]/80 pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto text-center">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#B69A68] font-sans font-semibold block mb-4">
              Destinations Portfolio
            </span>
          </ScrollReveal>
          <MaskedTextReveal delay={0.2}>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white mb-6 leading-[1.05]">
              Ten Extraordinary Lands.
            </h1>
          </MaskedTextReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-sm sm:text-base text-[#D9D0C2]/80 font-light max-w-2xl mx-auto leading-relaxed mb-10">
              From the misty gorilla sanctuaries of Uganda and Rwanda to the limitless migration plains of Tanzania and Kenya, the vineyards of South Africa, the dunes of Dubai, and the ancient monuments of Egypt.
            </p>
          </ScrollReveal>

          {/* Region Tabs — Virgin LE minimalist pills */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="flex flex-wrap justify-center items-center gap-2 pt-6 border-t border-white/10 max-w-4xl mx-auto">
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`px-5 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                    selectedRegion === reg.id
                      ? 'bg-[#B69A68] text-[#0f0f0f]'
                      : 'bg-white/5 text-[#D9D0C2] hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {reg.label}
                </button>
              ))}

              <button
                onClick={() => setIsComparisonOpen(true)}
                className="px-5 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer bg-white/10 hover:bg-[#B69A68] hover:text-[#0f0f0f] text-[#B69A68] border border-[#B69A68]/40 flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Territories</span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Expedition Search & Filter */}
      <div className="relative -mt-8 mb-12 z-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <ScrollReveal direction="up" delay={0.15}>
          <SearchFilterBar onSearch={handleSearch} />
        </ScrollReveal>
      </div>

      {/* Interactive African Expedition Map */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 mb-16">
        <ScrollReveal direction="up" delay={0.2}>
          <InteractiveTravelMap
            onNavigate={onNavigate}
            highlightedDestinations={['uganda', 'kenya', 'tanzania', 'rwanda', 'botswana', 'zanzibar']}
          />
        </ScrollReveal>
      </div>

      {/* Destinations Editorial Gallery Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filtered.map((dest, idx) => {
            const brandColor = BRAND_COLORS[dest.slug] || '#78634B';

            return (
              <ScrollReveal key={dest.slug} direction="up" delay={0.1 + (idx % 3) * 0.1}>
                <div
                  onClick={() => onNavigate(`/destinations/${dest.slug}`)}
                  className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden flex flex-col hover-lift h-full relative"
                >
                  {/* Floating Badge */}
                  <div
                    className="floating-badge"
                    style={{ backgroundColor: brandColor, color: 'white' }}
                  >
                    {dest.region}
                  </div>

                  {/* Destination Card Hero Image */}
                  <div className="relative h-72 sm:h-80 overflow-hidden bg-[#20221F]">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <span
                        className="text-[10px] uppercase tracking-[0.25em] font-semibold block mb-2"
                        style={{ color: brandColor }}
                      >
                        {dest.country}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#20221F] group-hover:text-[#78634B] transition-colors mb-3">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-[#20221F]/70 leading-relaxed font-light mb-6 line-clamp-3">
                        {dest.description}
                      </p>

                      <div className="mb-6 pt-4 border-t border-[#D9D0C2]/40">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#78634B] block mb-1.5">
                          Highlights:
                        </span>
                        <p className="text-xs text-[#20221F]/60 font-light">
                          {dest.wildlifeHighlights.join(' · ')}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#D9D0C2] flex items-center justify-between text-xs">
                      <span className="text-[#78634B] font-medium text-[11px]">
                        Best: {dest.bestTimeToVisit.split('(')[0]}
                      </span>
                      <span
                        className="font-semibold uppercase tracking-[0.15em] text-[11px] flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform"
                        style={{ color: brandColor }}
                      >
                        <span>Explore Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      <DestinationComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        allDestinations={destinations}
        onNavigate={onNavigate}
      />
    </div>
  );
};
