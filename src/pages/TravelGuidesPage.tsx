import React from 'react';
import { TRAVEL_GUIDES } from '../data/guidesData';
import { ArrowRight, Clock, Calendar, BookOpen } from 'lucide-react';

interface TravelGuidesPageProps {
  onNavigate: (path: string) => void;
}

export const TravelGuidesPage: React.FC<TravelGuidesPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-20 bg-[#F7F4ED]">
      {/* Header */}
      <div className="bg-[#20221F] text-[#F7F4ED] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#343C32]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-2">
            Field Notes & Insights
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#F7F4ED] mb-4">
            Travel Guides & Safari Inspiration
          </h1>
          <p className="text-sm sm:text-base text-[#D9D0C2] font-light max-w-2xl leading-relaxed">
            Written by our naturalist guides and expedition directors to help you understand seasonal wildlife rhythms, camera setups, and ethical primate etiquette.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRAVEL_GUIDES.map((guide) => (
            <div
              key={guide.slug}
              onClick={() => onNavigate(`/travel-guides/${guide.slug}`)}
              className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={guide.heroImage}
                  alt={guide.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-[#20221F]/80 text-[#F7F4ED] text-[10px] uppercase tracking-wider px-2.5 py-1">
                  {guide.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-[#78634B] font-medium uppercase tracking-wider mb-2">
                    <span>{guide.publishDate}</span>
                    <span>·</span>
                    <span>{guide.readTime}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-light text-[#20221F] group-hover:text-[#78634B] transition-colors mb-3">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-[#20221F]/70 leading-relaxed font-light mb-6 line-clamp-3">
                    {guide.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D9D0C2] flex items-center justify-between text-xs">
                  <span className="text-[#20221F]/60 text-[11px]">
                    By {guide.author}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#78634B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
