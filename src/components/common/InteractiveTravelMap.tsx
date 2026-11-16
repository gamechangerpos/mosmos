import React, { useState } from 'react';
import { MapPin, Compass, ArrowRight, X, Sparkles } from 'lucide-react';

interface MapDestinationPin {
  id: string;
  name: string;
  country: string;
  x: number; // percentage coordinate 0-100 on the SVG viewBox
  y: number; // percentage coordinate 0-100 on the SVG viewBox
  tagline: string;
  image: string;
  wildlife: string[];
  bestSeason: string;
  slug: string;
}

const DESTINATION_PINS: MapDestinationPin[] = [
  {
    id: 'uganda',
    name: 'Uganda',
    country: 'Pearl of Africa',
    x: 62,
    y: 52,
    tagline: 'Misty rainforests, mountain gorillas in Bwindi, chimpanzees in Kibale & Murchison Falls.',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
    wildlife: ['Mountain Gorillas', 'Chimpanzees', 'Tree-climbing Lions'],
    bestSeason: 'Jun–Sep & Dec–Feb',
    slug: 'uganda'
  },
  {
    id: 'rwanda',
    name: 'Rwanda',
    country: 'Land of a Thousand Hills',
    x: 60,
    y: 56,
    tagline: 'Volcanoes National Park gorilla sanctuaries, golden monkeys, and ultra-luxury eco lodges.',
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80',
    wildlife: ['Mountain Gorillas', 'Golden Monkeys', 'Colobus Troops'],
    bestSeason: 'Jun–Sep & Dec–Feb',
    slug: 'rwanda'
  },
  {
    id: 'kenya',
    name: 'Kenya',
    country: 'Heart of the Great Migration',
    x: 68,
    y: 53,
    tagline: 'Maasai Mara endless plains, Amboseli elephant herds under Kilimanjaro & Samburu.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    wildlife: ['Big Five', 'Great Migration', 'Cheetahs', 'Black Rhinos'],
    bestSeason: 'Jul–Oct & Jan–Feb',
    slug: 'kenya'
  },
  {
    id: 'tanzania',
    name: 'Tanzania',
    country: 'Serengeti & Ngorongoro',
    x: 67,
    y: 60,
    tagline: 'Vast volcanic calderas, boundless Serengeti savanna, and tree-climbing lions in Manyara.',
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
    wildlife: ['Wildebeest Migration', 'Black-maned Lions', 'Leopards'],
    bestSeason: 'Jun–Oct & Jan–Mar',
    slug: 'tanzania'
  },
  {
    id: 'zanzibar',
    name: 'Zanzibar',
    country: 'The Spice Archipelago',
    x: 73,
    y: 62,
    tagline: 'Turquoise Indian Ocean waters, Stone Town heritage, and private barefoot luxury sandbanks.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    wildlife: ['Dolphins', 'Giant Aldabra Tortoises', 'Coral Reefs'],
    bestSeason: 'Jul–Oct & Dec–Mar',
    slug: 'zanzibar'
  },
  {
    id: 'botswana',
    name: 'Botswana',
    country: 'Okavango & Chobe',
    x: 52,
    y: 77,
    tagline: 'Lush inland waterways, mokoro safaris, and the highest concentration of elephants on Earth.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    wildlife: ['Okavango Elephants', 'African Wild Dogs', 'Leopards'],
    bestSeason: 'May–Oct (Dry flood season)',
    slug: 'botswana'
  }
];

interface InteractiveTravelMapProps {
  onNavigate?: (path: string) => void;
  selectedDestinationId?: string;
  onSelectDestination?: (slug: string) => void;
  highlightedDestinations?: string[];
}

export const InteractiveTravelMap: React.FC<InteractiveTravelMapProps> = ({
  onNavigate,
  selectedDestinationId,
  onSelectDestination,
  highlightedDestinations
}) => {
  const [activePin, setActivePin] = useState<MapDestinationPin | null>(() => {
    if (selectedDestinationId) {
      return DESTINATION_PINS.find(p => p.id === selectedDestinationId || p.slug === selectedDestinationId) || DESTINATION_PINS[0];
    }
    return DESTINATION_PINS[0];
  });

  const handlePinClick = (pin: MapDestinationPin) => {
    setActivePin(pin);
    if (onSelectDestination) {
      onSelectDestination(pin.slug);
    }
  };

  return (
    <div className="bg-[#20221F] text-[#F7F4ED] rounded-lg p-6 sm:p-10 border border-[#B69A68]/30 shadow-2xl relative overflow-hidden">
      {/* Decorative background grid */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #B69A68 1px, transparent 0)',
          backgroundSize: '28px 28px'
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
        
        {/* Left Side: Map Graphic */}
        <div className="w-full lg:w-3/5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#B69A68] animate-spin-slow" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B69A68] font-semibold">
                African Expedition Geography
              </span>
            </div>
            <span className="text-[11px] text-[#F7F4ED]/50 hidden sm:inline">
              Click any pin to inspect expedition highlights
            </span>
          </div>

          <div className="relative w-full max-w-[520px] aspect-[4/4.5] bg-[#2A2C28]/80 rounded-xl p-4 sm:p-6 border border-[#B69A68]/20 flex items-center justify-center shadow-inner">
            {/* SVG stylized outline of Africa */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-md"
              style={{ maxHeight: '440px' }}
            >
              {/* Africa Continent Vector Geometry */}
              <path
                d="M 32,14 
                   C 42,12 55,10 65,15 
                   C 72,18 78,24 80,30 
                   C 82,36 86,40 88,44 
                   C 86,48 76,52 74,58 
                   C 72,64 72,70 68,76 
                   C 64,82 58,92 50,96 
                   C 44,92 40,86 38,80 
                   C 36,74 38,66 36,60 
                   C 32,56 22,50 18,44 
                   C 16,36 20,26 26,20 
                   Z"
                fill="#343833"
                stroke="#B69A68"
                strokeWidth="0.75"
                strokeDasharray="2,1"
              />

              {/* Equator line */}
              <line 
                x1="18" y1="53" x2="86" y2="53" 
                stroke="#B69A68" 
                strokeWidth="0.3" 
                strokeDasharray="1,2" 
                opacity="0.4"
              />
              <text x="20" y="52" fill="#B69A68" fontSize="2" opacity="0.5" letterSpacing="0.2">
                EQUATOR 0°
              </text>

              {/* Great Rift Valley Arc */}
              <path
                d="M 68,44 C 65,52 64,62 66,72"
                fill="none"
                stroke="#B69A68"
                strokeWidth="0.5"
                strokeDasharray="1,1"
                opacity="0.6"
              />

              {/* Destination Pins */}
              {DESTINATION_PINS.map((pin) => {
                const isSelected = activePin?.id === pin.id;
                const isHighlighted = highlightedDestinations?.includes(pin.id) || highlightedDestinations?.includes(pin.slug);

                return (
                  <g
                    key={pin.id}
                    className="cursor-pointer group"
                    onClick={() => handlePinClick(pin)}
                    transform={`translate(${pin.x}, ${pin.y})`}
                  >
                    {/* Pulsing ring for active or highlighted */}
                    {(isSelected || isHighlighted) && (
                      <circle
                        r="3.5"
                        fill="none"
                        stroke="#B69A68"
                        strokeWidth="0.4"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer marker ring */}
                    <circle
                      r="2"
                      fill={isSelected ? '#B69A68' : '#20221F'}
                      stroke="#B69A68"
                      strokeWidth="0.6"
                      className="transition-transform duration-300 group-hover:scale-125"
                    />

                    {/* Inner core dot */}
                    <circle
                      r="0.8"
                      fill={isSelected ? '#20221F' : '#F7F4ED'}
                    />

                    {/* Pin Label text */}
                    <text
                      x="3.2"
                      y="0.8"
                      fill={isSelected ? '#B69A68' : '#F7F4ED'}
                      fontSize="2.4"
                      fontWeight={isSelected ? '600' : '400'}
                      fontFamily="serif"
                      letterSpacing="0.2"
                      className="transition-colors group-hover:fill-[#B69A68]"
                    >
                      {pin.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Side: Selected Destination Card */}
        <div className="w-full lg:w-2/5">
          {activePin ? (
            <div className="bg-[#181917] border border-[#B69A68]/40 p-6 sm:p-7 rounded-lg shadow-xl relative animate-fadeIn">
              <div className="relative h-44 rounded-md overflow-hidden mb-5">
                <img
                  src={activePin.image}
                  alt={activePin.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#B69A68] font-semibold block">
                    {activePin.country}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-white">
                    {activePin.name}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#F7F4ED]/80 leading-relaxed mb-4 font-light">
                {activePin.tagline}
              </p>

              <div className="space-y-3 mb-6 text-xs">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#B69A68] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#F7F4ED]/50 block text-[10px] uppercase tracking-wider">
                      Signature Wildlife Encounters
                    </span>
                    <span className="text-[#F7F4ED]/90 font-medium">
                      {activePin.wildlife.join(' · ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#B69A68] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#F7F4ED]/50 block text-[10px] uppercase tracking-wider">
                      Optimal Safari Season
                    </span>
                    <span className="text-[#F7F4ED]/90 font-medium">
                      {activePin.bestSeason}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate && onNavigate(`/destinations/${activePin.slug}`)}
                  className="flex-1 py-2.5 px-4 bg-[#B69A68] hover:bg-[#8F7449] text-[#20221F] font-semibold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-sm"
                >
                  <span>Explore Destination</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate && onNavigate(`/plan-trip?destination=${activePin.slug}`)}
                  className="py-2.5 px-4 border border-[#B69A68]/60 hover:bg-[#B69A68]/10 text-[#F7F4ED] text-[11px] uppercase tracking-wider transition-colors cursor-pointer rounded-sm"
                >
                  Plan Trip
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#F7F4ED]/50 border border-dashed border-[#B69A68]/30 rounded-lg">
              <MapPin className="w-8 h-8 text-[#B69A68] mx-auto mb-2 opacity-50" />
              <p className="text-xs uppercase tracking-wider">Select a territory on the map</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
