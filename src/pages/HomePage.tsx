import React, { useRef } from 'react';
import { CinematicHero } from '../components/CinematicHero';
import { CinematicVideo } from '../components/common/CinematicVideo';
import { WildlifeCinematicSequence } from '../components/home/WildlifeCinematicSequence';
import { ScrollReveal, MaskedTextReveal, ParallaxImage, VirginCurtainReveal } from '../components/animations/ScrollReveal';
import { DESTINATIONS } from '../data/destinationsData';
import { SAFARI_TOURS } from '../data/toursData';
import { ACCOMMODATIONS } from '../data/staysData';
import { TRAVEL_PACKAGES } from '../data/packagesData';
import { useCmsPackages, useCmsDestinations } from '../services/cmsService';
import { ArrowRight, Compass, ShieldCheck, HeartHandshake, Eye, CheckCircle2, Star, Camera, Quote } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onHeaderVisibleChange: (visible: boolean) => void;
}

// Virgin LE brand colors mapped to MOS MOS destinations
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

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onHeaderVisibleChange }) => {
  const contentSectionRef = useRef<HTMLDivElement | null>(null);
  const { destinations } = useCmsDestinations(false);
  const { packages } = useCmsPackages(false);

  const displayDestinations = destinations && destinations.length > 0 ? destinations : DESTINATIONS;
  const displayPackages = packages && packages.length > 0 ? packages : TRAVEL_PACKAGES;

  const handleExploreScroll = () => {
    if (contentSectionRef.current) {
      contentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#F7F4ED] relative overflow-x-hidden">
      {/* 1. Cinematic Video Hero with Rotating Videos */}
      <CinematicHero
        onExploreClick={handleExploreScroll}
        onPlanTripClick={() => onNavigate('/plan-trip')}
        onHeaderVisibleChange={onHeaderVisibleChange}
      />

      {/* ═══════════════════════════════════════════════
          3. DESTINATIONS — Virgin LE Asymmetric Editorial Split
          ═══════════════════════════════════════════════ */}
      <section ref={contentSectionRef} className="py-24 sm:py-32 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header — Virgin LE centered overline pattern */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#78634B] font-sans font-semibold block mb-3">
              Destinations Portfolio
            </span>
          </ScrollReveal>
          <MaskedTextReveal delay={0.2} duration={1.0}>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#20221F] leading-[1.1] mb-4">
              Extraordinary places. Unforgettable journeys.
            </h2>
          </MaskedTextReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-sm text-[#20221F]/60 font-light leading-relaxed max-w-xl mx-auto">
              From the misty highlands of Uganda to the endless plains of the Serengeti — discover our curated collection of the world's most extraordinary destinations.
            </p>
          </ScrollReveal>
        </div>

        {/* Row 1: 40/60 Asymmetric Editorial Split (Virgin LE signature) */}
        <div className="editorial-split mb-12">
          {/* Left column — 40% text editorial */}
          <ScrollReveal direction="left" delay={0.15} duration={1.1}>
            <div className="flex flex-col justify-center py-8 md:py-12 md:pr-8">
              <span
                className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-3 block"
                style={{ color: BRAND_COLORS['uganda'] }}
              >
                East Africa · Primates & Savanna
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#20221F] leading-[1.1] mb-4">
                Uganda
              </h3>
              <p className="text-sm text-[#20221F]/70 font-light leading-relaxed mb-6 max-w-sm">
                {displayDestinations[0].tagline}
              </p>
              <button
                onClick={() => onNavigate('/destinations/uganda')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#20221F] hover:text-[#B69A68] transition-colors cursor-pointer group"
              >
                <span>Explore Mountain Gorillas & Safaris</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </ScrollReveal>

          {/* Right column — 60% hero image */}
          <div
            onClick={() => onNavigate('/destinations/uganda')}
            className="group cursor-pointer relative h-[400px] sm:h-[500px] lg:h-[560px] overflow-hidden bg-[#20221F]"
          >
            <img
              src={displayDestinations[0].heroImage}
              alt={displayDestinations[0].name}
              loading="eager"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            {/* Floating Badge — Virgin LE style */}
            <div
              className="floating-badge"
              style={{ backgroundColor: BRAND_COLORS['uganda'], color: 'white' }}
            >
              Featured
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        {/* Row 2: Reversed 60/40 Split — Tanzania */}
        <div className="editorial-split editorial-split--reverse mb-12">
          {/* Left — 60% image */}
          <div
            onClick={() => onNavigate('/destinations/tanzania')}
            className="group cursor-pointer relative h-[400px] sm:h-[500px] lg:h-[560px] overflow-hidden bg-[#20221F]"
          >
            <img
              src={displayDestinations[1].heroImage}
              alt={displayDestinations[1].name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div
              className="floating-badge"
              style={{ backgroundColor: BRAND_COLORS['tanzania'], color: 'white' }}
            >
              Great Migration
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Right — 40% text */}
          <ScrollReveal direction="right" delay={0.25} duration={1.1}>
            <div className="flex flex-col justify-center py-8 md:py-12 md:pl-8">
              <span
                className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-3 block"
                style={{ color: BRAND_COLORS['tanzania'] }}
              >
                East Africa · Great Migration
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#20221F] leading-[1.1] mb-4">
                Tanzania
              </h3>
              <p className="text-sm text-[#20221F]/70 font-light leading-relaxed mb-6 max-w-sm">
                {displayDestinations[1].tagline}
              </p>
              <button
                onClick={() => onNavigate('/destinations/tanzania')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#20221F] hover:text-[#B69A68] transition-colors cursor-pointer group"
              >
                <span>Explore Serengeti & Zanzibar</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Row 3: Three-column masonry — Rwanda, Kenya, South Africa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {[displayDestinations[2], displayDestinations[3], displayDestinations[4]].filter(Boolean).map((dest, i) => {
            const directions: ('left' | 'up' | 'right')[] = ['left', 'up', 'right'];
            const brandColor = BRAND_COLORS[dest.slug] || '#78634B';
            return (
              <ScrollReveal key={dest.slug} direction={directions[i]} delay={0.15 + i * 0.1}>
                <div
                  onClick={() => onNavigate(`/destinations/${dest.slug}`)}
                  className="group cursor-pointer relative overflow-hidden bg-[#20221F] hover-lift"
                >
                  <div className="relative h-[380px] sm:h-[420px]">
                      <img
                        src={dest.heroImage}
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                        <span
                          className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-1.5"
                          style={{ color: brandColor }}
                        >
                          {dest.region}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-light mb-2">
                          {dest.name}
                        </h3>
                        <p className="text-xs text-[#D9D0C2] line-clamp-2 font-light mb-4 max-w-sm">
                          {dest.tagline}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold group-hover:translate-x-1.5 transition-transform" style={{ color: brandColor }}>
                          <span>Discover {dest.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Row 4: Five compact destination cards — staggered masonry */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {[displayDestinations[5], displayDestinations[6], displayDestinations[7], displayDestinations[8], displayDestinations[9]].filter(Boolean).map((dest, i) => {
            const directions: ('left' | 'up' | 'down' | 'up' | 'right')[] = ['left', 'up', 'down', 'up', 'right'];
            const brandColor = BRAND_COLORS[dest.slug] || '#78634B';
            return (
              <ScrollReveal key={dest.slug} direction={directions[i % directions.length]} delay={0.1 + i * 0.08}>
                <div
                  onClick={() => onNavigate(`/destinations/${dest.slug}`)}
                  className="group cursor-pointer relative h-[240px] sm:h-[260px] overflow-hidden bg-[#20221F] hover-lift"
                >
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                    <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: brandColor }}>
                      {dest.region}
                    </span>
                    <h4 className="font-serif text-lg font-light">
                      {dest.name}
                    </h4>
                    <span className="text-[10px] text-[#D9D0C2]/80 mt-1 flex items-center gap-1 group-hover:text-white transition-colors">
                      <span>View Guide</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* View All Link */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('/destinations')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#78634B] hover:text-[#20221F] transition-colors cursor-pointer border-b border-[#78634B]/30 pb-1"
            >
              <span>View All 10 Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════════
          4. VIDEO INTERSTITIAL — Full-width cinematic break
          (Virgin LE pattern: full-bleed video between sections)
          ═══════════════════════════════════════════════ */}
      <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden bg-[#0f0f0f]">
        <CinematicVideo
          src="/media/videos/Virgin_Limited_Edition_Showreel_Hero_Video.mp4"
          mobileObjectPosition="center 35%"
          desktopObjectPosition="center center"
          priority={false}
          containerClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none">
          <ScrollReveal direction="up" delay={0.2}>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#B69A68] font-semibold block mb-4">
              Cinematic Journeys
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.1] mb-6 max-w-3xl">
              Every expedition is a story worth living.
            </h2>
            <button
              onClick={() => onNavigate('/safari-tours')}
              className="pointer-events-auto px-8 py-3.5 border border-white/40 text-white text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-white hover:text-[#20221F] transition-all duration-300 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Our Safaris</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. CINEMATIC WILDLIFE EDITORIAL
          ═══════════════════════════════════════════════ */}
      <WildlifeCinematicSequence onNavigate={onNavigate} />

      {/* ═══════════════════════════════════════════════
          6. SIGNATURE SAFARI TOURS — with floating badges
          ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#78634B] font-sans font-semibold block mb-3">
              Curated Expeditions
            </span>
          </ScrollReveal>
          <MaskedTextReveal delay={0.2}>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#20221F] leading-[1.1] mb-4">
              Closer to nature. Closer to extraordinary.
            </h2>
          </MaskedTextReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-sm text-[#20221F]/60 font-light leading-relaxed max-w-xl mx-auto">
              Each safari is meticulously crafted by our local expedition architects — combining private wilderness access, expert guides, and unforgettable wildlife encounters.
            </p>
          </ScrollReveal>
        </div>

        {/* 3 Featured Tours with Floating Badges & Hover Physics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {SAFARI_TOURS.slice(0, 3).map((tour, i) => {
            const directions: ('left' | 'up' | 'right')[] = ['left', 'up', 'right'];
            return (
              <ScrollReveal key={tour.slug} direction={directions[i]} delay={0.15 + i * 0.1}>
                <div
                  onClick={() => onNavigate(`/safari-tours/${tour.slug}`)}
                  className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden flex flex-col hover-lift relative h-full"
                >
                  {/* Floating Badge — Virgin LE pattern */}
                  <div className="floating-badge">
                    {tour.durationDays} Days
                  </div>

                  <div className="relative h-64 sm:h-72 overflow-hidden bg-[#20221F]">
                    <img
                      src={tour.heroImage}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute bottom-3 left-3 bg-[#20221F]/80 backdrop-blur-sm text-[#F7F4ED] text-[10px] uppercase tracking-wider px-3 py-1 font-semibold">
                      {tour.destination}
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-light text-[#20221F] group-hover:text-[#78634B] transition-colors mb-2">
                        {tour.title}
                      </h3>
                      <p className="text-xs text-[#20221F]/70 leading-relaxed font-light mb-4 line-clamp-2">
                        {tour.summary}
                      </p>
                      <ul className="space-y-1.5 mb-6 text-xs text-[#20221F]/70">
                        {tour.highlights.slice(0, 3).map((hl, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#78634B] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-[#D9D0C2] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 block">
                          From
                        </span>
                        <span className="font-serif text-lg text-[#20221F] font-semibold">
                          ${tour.indicativePrice?.toLocaleString()}{' '}
                          <span className="text-xs font-normal text-[#20221F]/60">/ person</span>
                        </span>
                      </div>
                      <span className="px-4 py-2 bg-[#20221F] text-[#F7F4ED] font-semibold uppercase tracking-wider text-[11px] group-hover:bg-[#78634B] transition-colors">
                        View Tour
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* View All Tours Link */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('/safari-tours')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#78634B] hover:text-[#20221F] transition-colors cursor-pointer border-b border-[#78634B]/30 pb-1"
            >
              <span>Explore All Tours</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════════
          7. LUXURY STAYS — Staggered masonry with brand accents
          ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 border-t border-[#D9D0C2]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#78634B] font-sans font-semibold block mb-3">
              Luxury Lodges & Camps
            </span>
          </ScrollReveal>
          <MaskedTextReveal delay={0.2}>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#20221F] leading-[1.1] mb-4">
              Stay somewhere extraordinary.
            </h2>
          </MaskedTextReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {ACCOMMODATIONS.slice(0, 4).map((stay, idx) => {
            const directions: ('left' | 'up' | 'down' | 'right')[] = ['left', 'up', 'up', 'right'];
            return (
              <ScrollReveal key={stay.slug} direction={directions[idx]} delay={0.1 + idx * 0.1}>
                <div
                  onClick={() => onNavigate(`/stays/${stay.slug}`)}
                  className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden flex flex-col hover-lift h-full relative"
                >
                  {/* Floating Badge */}
                  <div className="floating-badge" style={{ backgroundColor: '#78634B', color: 'white' }}>
                    {stay.type}
                  </div>

                  <div className="relative h-56 sm:h-60 overflow-hidden">
                    <img
                      src={stay.heroImage}
                      alt={stay.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                        {stay.location}
                      </span>
                      <h3 className="font-serif text-xl font-light text-[#20221F] group-hover:text-[#78634B] transition-colors mb-2">
                        {stay.name}
                      </h3>
                      <p className="text-xs text-[#20221F]/70 font-light leading-relaxed line-clamp-2 mb-4">
                        {stay.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#D9D0C2]/50 flex items-center justify-between text-xs">
                      <span className="text-[#78634B] font-medium">
                        ${stay.indicativePricePerNight} <span className="text-[10px] text-[#20221F]/50">/ night</span>
                      </span>
                      <span className="text-[11px] font-semibold text-[#20221F] uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Reserve</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('/stays')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#78634B] hover:text-[#20221F] transition-colors cursor-pointer border-b border-[#78634B]/30 pb-1"
            >
              <span>View All Stays & Lodges</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════════
          8. TRAVEL PACKAGES — Asymmetric Editorial
          ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 border-t border-[#D9D0C2]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#78634B] font-sans font-semibold block mb-3">
              Curated Packages
            </span>
          </ScrollReveal>
          <MaskedTextReveal delay={0.2}>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#20221F] leading-[1.1] mb-4">
              Beautifully planned. Ready to discover.
            </h2>
          </MaskedTextReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {displayPackages.slice(0, 3).map((pkg, i) => {
            const dir: ('left' | 'up' | 'right')[] = ['left', 'up', 'right'];
            return (
              <ScrollReveal key={pkg.slug} direction={dir[i]} delay={0.15 + i * 0.12}>
                <div
                  onClick={() => onNavigate(`/travel-packages/${pkg.slug}`)}
                  className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden flex flex-col hover-lift h-full relative"
                >
                  {/* Floating Badge */}
                  <div className="floating-badge">
                    {pkg.duration}
                  </div>

                  <div className="relative h-60 sm:h-64 overflow-hidden">
                    <img
                      src={pkg.heroImage}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#78634B] font-semibold block mb-1">
                        {pkg.category}
                      </span>
                      <h3 className="font-serif text-2xl font-light text-[#20221F] group-hover:text-[#78634B] transition-colors mb-2">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-[#20221F]/70 leading-relaxed font-light mb-4 line-clamp-2">
                        {pkg.overview}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-[#D9D0C2] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 block">
                          From
                        </span>
                        <span className="font-serif text-lg font-semibold text-[#20221F]">
                          ${pkg.indicativePrice?.toLocaleString()} <span className="text-xs font-normal text-[#20221F]/50">/ guest</span>
                        </span>
                      </div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-[#78634B] group-hover:text-[#20221F] flex items-center gap-1 transition-colors">
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('/travel-packages')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#78634B] hover:text-[#20221F] transition-colors cursor-pointer border-b border-[#78634B]/30 pb-1"
            >
              <span>View All 10 Packages</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════════
          9. THE MOS MOS STANDARD — Trust & Ethos
          ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 border-t border-[#D9D0C2]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#78634B] font-sans font-semibold block mb-3">
              The MOS MOS Standard
            </span>
          </ScrollReveal>
          <MaskedTextReveal delay={0.2}>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#20221F] mb-4">
              Why journey with MOS MOS Safaris?
            </h2>
          </MaskedTextReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-sm text-[#20221F]/60 font-light leading-relaxed">
              We are East African safari architects dedicated to conservation-first expeditions, guaranteed primate permits, and deeply authentic wilderness access.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[
            {
              icon: <Compass className="w-7 h-7" />,
              title: 'Deep Regional Knowledge',
              desc: 'Our roots are in Uganda, Kenya, and Tanzania. We partner directly with national park authorities and vetted conservancies, not brokers.',
              dir: 'left' as const,
            },
            {
              icon: <ShieldCheck className="w-7 h-7" />,
              title: 'Official Permit Allocation',
              desc: 'We secure official mountain gorilla and chimpanzee permits directly with the Uganda Wildlife Authority (UWA) and Rwanda Development Board (RDB).',
              dir: 'up' as const,
            },
            {
              icon: <Eye className="w-7 h-7" />,
              title: 'Custom Safari Cruisers',
              desc: 'Travel exclusively in custom 4x4 Land Cruisers with pop-up photography hatches, window seats for all guests, inverter charging, and refrigeration.',
              dir: 'down' as const,
            },
            {
              icon: <HeartHandshake className="w-7 h-7" />,
              title: 'Transparent Communication',
              desc: 'Honest advice on seasonal weather, migration patterns, and physical requirements. No fabricated availability or hidden surcharges.',
              dir: 'right' as const,
            },
          ].map((item, i) => (
            <ScrollReveal key={item.title} direction={item.dir} delay={0.15 + i * 0.1}>
              <div className="p-7 bg-white border border-[#D9D0C2] h-full hover-lift">
                <div className="text-[#78634B] mb-5">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-light text-[#20221F] mb-3">
                  {item.title}
                </h3>
                <p className="text-xs text-[#20221F]/60 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9B. VERIFIED TESTIMONIALS & EXPEDITION GALLERY
          ═══════════════════════════════════════════════ */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#D9D0C2]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <ScrollReveal direction="down" delay={0.1}>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#78634B] font-semibold block mb-3">
                Field Reports & Patron Experiences
              </span>
            </ScrollReveal>
            <MaskedTextReveal delay={0.2}>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#20221F] leading-tight">
                Reflections From the Wilderness
              </h2>
            </MaskedTextReveal>
          </div>
          <ScrollReveal direction="left" delay={0.3}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('/gallery')}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#78634B] hover:text-[#20221F] transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>View Full Photo Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: 'Sitting five meters from a 400-pound mountain gorilla silverback in Bwindi. The habituation permits and luxury camp overlooking the mist were executed with absolute precision.',
              author: 'Marcus & Claire Dupont',
              location: 'Geneva, Switzerland',
              trip: 'Uganda Primate & Gorilla Trek',
              rating: 5,
            },
            {
              quote: 'The Mara River wildebeest crossing was an awe-inspiring spectacle. Our private guide Samuel possessed encyclopedic knowledge of predator movements and positioned us flawlessly.',
              author: 'Eleanor Vance',
              location: 'London, United Kingdom',
              trip: 'Serengeti & Mara Migration',
              rating: 5,
            },
            {
              quote: 'Every detail for our three generations was considered. From hot air balloon safaris at dawn to private starlit bush dinners, MOS MOS created memories we will cherish forever.',
              author: 'Amara Kalu',
              location: 'Toronto, Canada',
              trip: 'Family Conservancy Safari',
              rating: 5,
            },
          ].map((item, idx) => (
            <ScrollReveal key={item.author} direction="up" delay={0.15 + idx * 0.1}>
              <div className="bg-white border border-[#D9D0C2] p-8 h-full flex flex-col justify-between hover-lift shadow-sm">
                <div>
                  <div className="flex items-center gap-1 text-[#B69A68] mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#78634B]/30 mb-3" />
                  <p className="text-xs sm:text-sm text-[#20221F]/80 font-light leading-relaxed mb-6 italic">
                    "{item.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-[#D9D0C2]/60">
                  <h4 className="font-serif text-base font-medium text-[#20221F]">
                    {item.author}
                  </h4>
                  <span className="text-[11px] text-[#20221F]/50 block">
                    {item.location}
                  </span>
                  <span className="text-[10px] text-[#78634B] uppercase tracking-wider font-semibold block mt-1">
                    {item.trip}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          10. FINAL CTA — Virgin LE editorial close
          ═══════════════════════════════════════════════ */}
      <section className="relative py-32 sm:py-40 overflow-hidden bg-[#0f0f0f]">
        {/* Background video */}
        <CinematicVideo
          src="/media/videos/Mahali_Mzuri_Hero_Video.mp4"
          mobileObjectPosition="center 40%"
          desktopObjectPosition="center center"
          priority={false}
          containerClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#B69A68] font-semibold block mb-4">
              Begin Your Story
            </span>
          </ScrollReveal>
          <MaskedTextReveal delay={0.2}>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light mb-4 text-white leading-[1.1]">
              Your adventure awaits.
            </h2>
          </MaskedTextReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-sm text-white/70 font-light leading-relaxed mb-10">
              Explore our curated gallery of destinations or send us an inquiry for your custom itinerary.
            </p>
          </ScrollReveal>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ScrollReveal direction="left" delay={0.4}>
              <button
                onClick={() => onNavigate('/destinations')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] font-semibold text-[11px] tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                Explore Gallery
              </button>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.4}>
              <button
                onClick={() => onNavigate('/plan-trip')}
                className="w-full sm:w-auto px-8 py-3.5 border border-white/40 text-white hover:bg-white hover:text-[#20221F] font-semibold text-[11px] tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer"
              >
                Send Inquiry
              </button>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};
