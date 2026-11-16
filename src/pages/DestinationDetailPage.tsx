import React, { useRef } from 'react';
import { useCmsDestinations } from '../services/cmsService';
import { SAFARI_TOURS } from '../data/toursData';
import { ACCOMMODATIONS } from '../data/staysData';
import { CinematicVideo } from '../components/common/CinematicVideo';
import { ReviewListWidget } from '../components/reviews/ReviewListWidget';
import { WishlistButton } from '../components/common/WishlistButton';
import { ArrowLeft, ArrowRight, CheckCircle2, Calendar, Sun, DollarSign, FileText, Compass, Sparkles, MapPin } from 'lucide-react';
import { ScrollReveal, MaskedTextReveal, ParallaxImage, VirginCurtainReveal } from '../components/animations/ScrollReveal';

interface DestinationDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

// Destination videos mapping from extracted Virgin LE assets with calibrated focal points
const DESTINATION_VIDEOS: Record<string, { src: string; caption: string; mobilePosition: string }> = {
  kenya: {
    src: '/media/videos/Mahali_Mzuri_Hero_Video.mp4',
    caption: 'Mahali Mzuri & Finch Hattons · Maasai Mara & Tsavo',
    mobilePosition: 'center 35%',
  },
  'south-africa': {
    src: '/media/videos/Ulusaba_Hero_Video.mp4',
    caption: 'Ulusaba Private Game Reserve · Sabi Sand & Kruger',
    mobilePosition: 'center 35%',
  },
  tanzania: {
    src: '/media/videos/Virgin_Limited_Edition_Showreel_Hero_Video.mp4',
    caption: 'Serengeti & Ngorongoro Caldera · The Great Migration',
    mobilePosition: 'center 35%',
  },
  egypt: {
    src: '/media/videos/Kasbah_Tamadot_Hero_Video.mp4',
    caption: 'North African Heritage · Pyramids & Ancient Nile',
    mobilePosition: 'center 30%',
  },
};

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

export const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({ slug, onNavigate }) => {
  const { destinations } = useCmsDestinations(true);
  const destination = destinations.find(d => d.slug === slug || d.id === slug) || destinations[0];
  const matchingTours = SAFARI_TOURS.filter(t => t.destinationSlug === destination.slug);
  const matchingStays = ACCOMMODATIONS.filter(s => s.destinationSlug === destination.slug);

  const brandColor = BRAND_COLORS[destination.slug] || '#78634B';
  const videoData = DESTINATION_VIDEOS[destination.slug];

  return (
    <div className="bg-[#F7F4ED] pb-24 overflow-x-hidden">
      {/* 1. Cinematic Video Hero Header (Virgin LE pattern) */}
      <div className="relative h-[80vh] min-h-[560px] bg-[#0f0f0f] overflow-hidden">
        {videoData ? (
          <CinematicVideo
            src={videoData.src}
            mobileObjectPosition={videoData.mobilePosition}
            desktopObjectPosition="center center"
            priority={true}
            containerClassName="w-full h-full"
          />
        ) : (
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/40 pointer-events-none" />

        {/* Back navigation & floating header */}
        <div className="absolute top-24 left-0 right-0 z-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('/destinations')}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-white/80 hover:text-white transition-colors cursor-pointer bg-black/40 backdrop-blur-md px-4 py-2 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Destinations</span>
          </button>
          <WishlistButton
            item={{
              itemId: destination.id,
              itemType: 'destination',
              slug: destination.slug,
              title: destination.name,
              heroImage: destination.heroImage,
              location: `${destination.region}, Africa`
            }}
            variant="button"
          />
        </div>

        {/* Hero Bottom Content */}
        <div className="absolute inset-x-0 bottom-0 z-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-12 sm:pb-16">
          <ScrollReveal direction="down" delay={0.1}>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-[10px] uppercase tracking-[0.35em] font-semibold px-3 py-1 bg-black/60 backdrop-blur-sm border border-white/10"
                style={{ color: brandColor }}
              >
                {destination.region}
              </span>
              {videoData && (
                <span className="text-[10px] text-white/60 tracking-wider hidden sm:inline">
                  {videoData.caption}
                </span>
              )}
            </div>
          </ScrollReveal>

          <MaskedTextReveal delay={0.2}>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white mb-4 leading-[0.95]">
              {destination.name}
            </h1>
          </MaskedTextReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-sm sm:text-base text-[#D9D0C2] font-light max-w-2xl leading-relaxed mb-6">
              {destination.tagline}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate(`/plan-trip?destination=${destination.name}`)}
                className="px-7 py-3 bg-[#B69A68] hover:bg-[#a68a58] text-[#0f0f0f] text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                Plan a Custom Journey
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('overview');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 border border-white/30 text-white hover:bg-white hover:text-[#0f0f0f] text-[11px] font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer"
              >
                Explore Guide
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* 2. Quick Travel Facts Bar — Virgin LE minimal stats bar */}
      <div className="bg-[#0f0f0f] text-[#F7F4ED] border-b border-white/10 py-7 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 shrink-0 mt-0.5" style={{ color: brandColor }} />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#D9D0C2]/50 block">Best Season</span>
              <p className="font-light text-[#F7F4ED] mt-0.5 leading-snug">{destination.bestTimeToVisit}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Sun className="w-4 h-4 shrink-0 mt-0.5" style={{ color: brandColor }} />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#D9D0C2]/50 block">Climate</span>
              <p className="font-light text-[#F7F4ED] mt-0.5 leading-snug">{destination.climate}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="w-4 h-4 shrink-0 mt-0.5" style={{ color: brandColor }} />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#D9D0C2]/50 block">Currency</span>
              <p className="font-light text-[#F7F4ED] mt-0.5 leading-snug">{destination.currency}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 shrink-0 mt-0.5" style={{ color: brandColor }} />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#D9D0C2]/50 block">Entry / Visa</span>
              <p className="font-light text-[#F7F4ED] mt-0.5 leading-snug">{destination.visaInfo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Narrative Description & Experiences — 40/60 Asymmetric Editorial */}
      <div id="overview" className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Description — 7 cols */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="down" delay={0.1}>
              <span
                className="text-[10px] uppercase tracking-[0.3em] font-semibold block mb-2"
                style={{ color: brandColor }}
              >
                Destination Overview
              </span>
            </ScrollReveal>
            <MaskedTextReveal delay={0.2}>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#20221F] mb-6 leading-tight">
                The Essence of {destination.name}
              </h2>
            </MaskedTextReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <p className="text-sm sm:text-base text-[#20221F]/75 font-light leading-relaxed mb-12">
                {destination.description}
              </p>
            </ScrollReveal>

            {/* Key Attractions — Virgin LE editorial cards with floating badges */}
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#20221F] mb-8 pt-8 border-t border-[#D9D0C2]">
              Notable Sanctuaries & Highlights
            </h3>
            <div className="space-y-6">
              {destination.keyAttractions.map((att, i) => (
                <ScrollReveal key={i} direction="up" delay={0.1 + i * 0.08}>
                  <div className="flex flex-col sm:flex-row gap-6 bg-white p-6 border border-[#D9D0C2] hover-lift relative">
                    <div className="w-full sm:w-48 h-36 shrink-0 overflow-hidden relative">
                      <img
                        src={att.image}
                        alt={att.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-serif text-xl sm:text-2xl font-light text-[#20221F] mb-2">
                        {att.name}
                      </h4>
                      <p className="text-xs text-[#20221F]/70 leading-relaxed font-light">
                        {att.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Sidebar: Recommended Experiences & Wildlife — 5 cols */}
          <div className="lg:col-span-5 space-y-8">
            <ScrollReveal direction="left" delay={0.2}>
              <div className="bg-[#0f0f0f] text-[#F7F4ED] p-8 sm:p-10 border border-white/10 relative">
                <span
                  className="text-[10px] uppercase tracking-[0.3em] font-semibold block mb-3"
                  style={{ color: brandColor }}
                >
                  Recommended Expeditions
                </span>
                <h3 className="font-serif text-2xl font-light text-white mb-6">
                  Signature Experiences
                </h3>
                <ul className="space-y-4 mb-8 text-xs text-[#D9D0C2]/80 font-light">
                  {destination.recommendedExperiences.map((exp, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: brandColor }} />
                      <span className="leading-relaxed">{exp}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-[#D9D0C2]/50 block mb-3">
                    Wildlife Species in Habitat
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {destination.wildlifeHighlights.map((w, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/10 text-xs text-[#F7F4ED] font-light">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Custom Trip Callout — Virgin LE luxury consultation box */}
            <ScrollReveal direction="left" delay={0.3}>
              <div className="bg-white p-8 sm:p-10 border border-[#D9D0C2] text-center hover-lift">
                <Compass className="w-8 h-8 mx-auto mb-4" style={{ color: brandColor }} />
                <h4 className="font-serif text-2xl font-light text-[#20221F] mb-3">
                  Tailor Your {destination.name} Journey
                </h4>
                <p className="text-xs text-[#20221F]/65 font-light leading-relaxed mb-6 max-w-sm mx-auto">
                  Tell us your preferred dates, party size, and travel style. Our regional directors will curate your private proposal.
                </p>
                <button
                  onClick={() => onNavigate(`/plan-trip?destination=${destination.name}`)}
                  className="w-full py-3.5 bg-[#0f0f0f] hover:bg-[#20221F] text-white text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                >
                  Inquire About {destination.name}
                </button>
              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* 4. Luxury Stays in this destination (if any) */}
        {matchingStays.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#D9D0C2]">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span
                  className="text-[10px] uppercase tracking-[0.3em] font-semibold block mb-1"
                  style={{ color: brandColor }}
                >
                  Accommodations
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#20221F]">
                  Signature Lodges & Camps in {destination.name}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/stays')}
                className="text-xs font-semibold uppercase tracking-[0.15em] text-[#78634B] hover:text-[#20221F] flex items-center gap-1 transition-colors"
              >
                <span>All Lodges</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {matchingStays.map((stay) => (
                <div
                  key={stay.slug}
                  onClick={() => onNavigate(`/stays/${stay.slug}`)}
                  className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden flex flex-col hover-lift relative"
                >
                  <div className="floating-badge" style={{ backgroundColor: brandColor, color: 'white' }}>
                    {stay.type}
                  </div>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={stay.heroImage}
                      alt={stay.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                        {stay.location}
                      </span>
                      <h4 className="font-serif text-xl font-light text-[#20221F] group-hover:text-[#78634B] transition-colors mb-2">
                        {stay.name}
                      </h4>
                      <p className="text-xs text-[#20221F]/70 line-clamp-2 font-light mb-4">
                        {stay.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#D9D0C2] flex items-center justify-between text-xs">
                      <span className="text-[#78634B] font-medium">
                        ${stay.indicativePricePerNight} <span className="text-[10px] text-[#20221F]/50">/ night</span>
                      </span>
                      <span className="text-[#20221F] font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Reserve</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Matching Safari Tours */}
        {matchingTours.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[#D9D0C2]">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span
                  className="text-[10px] uppercase tracking-[0.3em] font-semibold block mb-1"
                  style={{ color: brandColor }}
                >
                  Expeditions
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#20221F]">
                  Curated Safari Tours in {destination.name}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/safari-tours')}
                className="text-xs font-semibold uppercase tracking-[0.15em] text-[#78634B] hover:text-[#20221F] flex items-center gap-1 transition-colors"
              >
                <span>All Safari Tours</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {matchingTours.map((tour) => (
                <div
                  key={tour.slug}
                  onClick={() => onNavigate(`/safari-tours/${tour.slug}`)}
                  className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden flex flex-col hover-lift relative"
                >
                  <div className="floating-badge">
                    {tour.durationDays} Days
                  </div>
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={tour.heroImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                        {tour.physicalRating} Level
                      </span>
                      <h4 className="font-serif text-xl font-light text-[#20221F] group-hover:text-[#78634B] transition-colors mb-2">
                        {tour.title}
                      </h4>
                      <p className="text-xs text-[#20221F]/70 line-clamp-2 font-light mb-4">
                        {tour.summary}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#D9D0C2] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#20221F]/50 uppercase tracking-wider block">From</span>
                        <span className="font-serif text-base font-semibold text-[#20221F]">
                          ${tour.indicativePrice?.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[#78634B] font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Traveler Reviews & Field Reports */}
        <div className="mt-16">
          <ReviewListWidget
            targetType="destination"
            targetSlug={destination.slug}
            targetTitle={destination.name}
          />
        </div>

      </div>
    </div>
  );
};
