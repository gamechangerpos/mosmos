import React, { useState } from 'react';
import { Search, Calendar, Users, Compass, DollarSign, Filter, ArrowRight } from 'lucide-react';
import { TripType } from '../types';

interface SearchFilterBarProps {
  onSearch: (params: {
    destination: string;
    tripType: string;
    season: string;
    travelers: string;
    budget: string;
  }) => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ onSearch }) => {
  const [destination, setDestination] = useState<string>('all');
  const [tripType, setTripType] = useState<string>('all');
  const [season, setSeason] = useState<string>('anytime');
  const [travelers, setTravelers] = useState<string>('2');
  const [budget, setBudget] = useState<string>('any');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      destination,
      tripType,
      season,
      travelers,
      budget
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto -mt-16 sm:-mt-20 relative z-30 px-4 sm:px-6">
      <div className="bg-[#20221F] text-[#F7F4ED] shadow-2xl border border-[#343C32] p-6 sm:p-8">
        {/* Section Headline */}
        <div className="mb-6 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B69A68] font-medium">
              Curate Your Expedition
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#F7F4ED] mt-1">
              Where will your next journey take you?
            </h2>
          </div>
          <p className="text-xs text-[#D9D0C2]/80 font-light max-w-xs">
            Filter our 10 premier African and global destinations by travel style and season.
          </p>
        </div>

        {/* Search Controls Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Destination */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#B69A68]" />
              Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-[#2A2E28] border border-white/15 text-[#F7F4ED] text-xs px-3 py-2.5 focus:border-[#B69A68] focus:outline-none transition-colors"
            >
              <option value="all">All Destinations (10)</option>
              <option value="uganda">Uganda (Gorillas & Nile)</option>
              <option value="tanzania">Tanzania (Serengeti & Crater)</option>
              <option value="rwanda">Rwanda (Virunga Volcanoes)</option>
              <option value="kenya">Kenya (Maasai Mara & Amboseli)</option>
              <option value="south-africa">South Africa (Kruger & Cape)</option>
              <option value="dubai">Dubai (Desert Dunes & Marina)</option>
              <option value="thailand">Thailand (Temples & Andaman)</option>
              <option value="bali">Bali (Ubud & Uluwatu)</option>
              <option value="ethiopia">Ethiopia (Lalibela & Simien)</option>
              <option value="egypt">Egypt (Pyramids & Nile Cruise)</option>
            </select>
          </div>

          {/* Trip Type */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#B69A68]" />
              Trip Type
            </label>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="bg-[#2A2E28] border border-white/15 text-[#F7F4ED] text-xs px-3 py-2.5 focus:border-[#B69A68] focus:outline-none transition-colors"
            >
              <option value="all">All Trip Types</option>
              <option value="wildlife-safari">Wildlife Safari</option>
              <option value="gorilla-trekking">Gorilla & Chimpanzee Trekking</option>
              <option value="great-migration">Great Migration Expedition</option>
              <option value="wildlife-photography">Wildlife Photography</option>
              <option value="luxury-lodge">Luxury Lodge & Bush Flight</option>
              <option value="cultural-experience">Ancient Culture & Heritage</option>
              <option value="beach-holiday">Bush & Beach Combination</option>
              <option value="custom-itinerary">Tailor-Made Custom Journey</option>
            </select>
          </div>

          {/* Travel Season / Approximate Departure */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B69A68]" />
              Departure Season
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="bg-[#2A2E28] border border-white/15 text-[#F7F4ED] text-xs px-3 py-2.5 focus:border-[#B69A68] focus:outline-none transition-colors"
            >
              <option value="anytime">Any Month / Flexible</option>
              <option value="jun-oct">Jun – Oct (Peak Migration & Dry)</option>
              <option value="dec-feb">Dec – Feb (Calving & Warm Dry)</option>
              <option value="mar-may">Mar – May (Lush Green Season)</option>
              <option value="nov-dec">Nov – Dec (Short Rains & Birding)</option>
            </select>
          </div>

          {/* Travelers */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-[#D9D0C2] mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#B69A68]" />
              Travelers
            </label>
            <select
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              className="bg-[#2A2E28] border border-white/15 text-[#F7F4ED] text-xs px-3 py-2.5 focus:border-[#B69A68] focus:outline-none transition-colors"
            >
              <option value="1">1 Solo Traveler</option>
              <option value="2">2 Couples / Sharing</option>
              <option value="small-group">3–5 Family / Small Group</option>
              <option value="private-charter">6+ Private Group / Charter</option>
            </select>
          </div>

          {/* Action Button */}
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow"
            >
              <Search className="w-4 h-4" />
              <span>Explore Results</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
