import React from 'react';
import { TRAVEL_GUIDES } from '../data/guidesData';
import { ArrowLeft, ArrowRight, Clock, Calendar, Share2, Compass } from 'lucide-react';

interface GuideDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({ slug, onNavigate }) => {
  const guide = TRAVEL_GUIDES.find(g => g.slug === slug) || TRAVEL_GUIDES[0];

  return (
    <div className="pt-20 pb-24 bg-[#F7F4ED]">
      {/* Hero Banner */}
      <div className="relative h-[55vh] min-h-[400px] bg-[#20221F] overflow-hidden">
        <img
          src={guide.heroImage}
          alt={guide.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-between max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
          <div>
            <button
              onClick={() => onNavigate('/travel-guides')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#D9D0C2] hover:text-[#FFFFFF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Travel Guides</span>
            </button>
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#B69A68] font-semibold block mb-2">
              {guide.category} · {guide.readTime}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#F7F4ED] mb-3">
              {guide.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-[#D9D0C2]/80 font-light">
              <span>Published {guide.publishDate}</span>
              <span>·</span>
              <span>By {guide.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-8 sm:p-12 border border-[#D9D0C2] shadow-sm">
          <p className="text-base sm:text-lg font-serif italic text-[#78634B] leading-relaxed mb-8 pb-6 border-b border-[#D9D0C2]">
            "{guide.excerpt}"
          </p>

          <div className="space-y-6 text-sm text-[#20221F]/80 leading-relaxed font-light">
            {guide.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-6 border-t border-[#D9D0C2] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">Tags:</span>
              {guide.tags.map(t => (
                <span key={t} className="px-2.5 py-1 bg-[#F7F4ED] text-[#20221F] border border-[#D9D0C2] text-xs">
                  {t}
                </span>
              ))}
            </div>

            <button
              onClick={() => onNavigate('/plan-trip')}
              className="px-5 py-2.5 bg-[#20221F] hover:bg-[#343C32] text-[#F7F4ED] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Plan a Trip Based on This Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
