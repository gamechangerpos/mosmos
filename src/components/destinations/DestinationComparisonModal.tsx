import React, { useState } from 'react';
import { X, Check, ArrowRight, Compass, ShieldAlert, Sparkles, Scale } from 'lucide-react';
import { Destination } from '../../types';

interface DestinationComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  allDestinations: Destination[];
  onNavigate: (path: string) => void;
}

export const DestinationComparisonModal: React.FC<DestinationComparisonModalProps> = ({
  isOpen,
  onClose,
  allDestinations,
  onNavigate
}) => {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => {
    // Default to comparing Uganda and Kenya
    const defaults = ['uganda', 'kenya'];
    return defaults.filter(slug => allDestinations.some(d => d.slug === slug));
  });

  if (!isOpen) return null;

  const handleToggleDestination = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      if (selectedSlugs.length > 1) {
        setSelectedSlugs(selectedSlugs.filter(s => s !== slug));
      }
    } else {
      if (selectedSlugs.length < 3) {
        setSelectedSlugs([...selectedSlugs, slug]);
      } else {
        // Replace last
        setSelectedSlugs([selectedSlugs[0], selectedSlugs[1], slug]);
      }
    }
  };

  const selectedDestinations = selectedSlugs
    .map(slug => allDestinations.find(d => d.slug === slug))
    .filter(Boolean) as Destination[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#F7F4ED] text-[#20221F] w-full max-w-5xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-[#D9D0C2]">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#20221F] text-[#F7F4ED] flex items-center justify-between border-b border-[#B69A68]/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-[#B69A68]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B69A68] font-semibold">
                Expedition Comparison Studio
              </span>
            </div>
            <h2 className="font-serif text-2xl font-light text-white">
              Compare African Safari Territories
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#F7F4ED] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Territory Selector Bar */}
        <div className="bg-[#EDE7DA] px-6 py-3 border-b border-[#D9D0C2] flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mr-2">
            Select 2 to 3 Territories:
          </span>
          {allDestinations.map((dest) => {
            const isSelected = selectedSlugs.includes(dest.slug);
            return (
              <button
                key={dest.slug}
                onClick={() => handleToggleDestination(dest.slug)}
                className={`px-3 py-1 text-xs rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#20221F] text-[#B69A68] font-semibold shadow-sm'
                    : 'bg-white/70 hover:bg-white text-[#20221F] border border-[#D9D0C2]'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-[#B69A68]" />}
                <span>{dest.name}</span>
              </button>
            );
          })}
        </div>

        {/* Comparison Grid Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedDestinations.map((dest) => (
              <div 
                key={dest.slug}
                className="bg-white border border-[#D9D0C2] rounded-md overflow-hidden flex flex-col shadow-sm"
              >
                {/* Hero preview */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#B69A68] font-semibold block">
                      {dest.region}
                    </span>
                    <h3 className="font-serif text-2xl font-light text-white">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs text-[#20221F]/70 italic mb-4 border-l-2 border-[#B69A68] pl-2.5">
                      "{dest.tagline}"
                    </p>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block">
                          Optimal Season
                        </span>
                        <p className="text-[#20221F] mt-0.5">{dest.bestTimeToVisit}</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block">
                          Climate & Conditions
                        </span>
                        <p className="text-[#20221F] mt-0.5">{dest.climate}</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block">
                          Signature Wildlife
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dest.wildlifeHighlights.slice(0, 4).map((w, i) => (
                            <span 
                              key={i} 
                              className="px-2 py-0.5 bg-[#F7F4ED] border border-[#D9D0C2] text-[10px] text-[#20221F] rounded"
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block">
                          Visa Information
                        </span>
                        <p className="text-[#20221F]/80 text-[11px] mt-0.5">{dest.visaInfo}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#D9D0C2] flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate(`/destinations/${dest.slug}`);
                      }}
                      className="flex-1 py-2 bg-[#20221F] hover:bg-[#78634B] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center"
                    >
                      View Territory
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate(`/plan-trip?destination=${dest.slug}`);
                      }}
                      className="px-3 py-2 border border-[#20221F] hover:bg-[#20221F] hover:text-white text-[#20221F] text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Plan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#D9D0C2] flex items-center justify-between text-xs text-[#20221F]/70">
          <span>Comparing {selectedDestinations.length} territories side-by-side</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#78634B] hover:text-[#20221F] cursor-pointer"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
