import React from 'react';
import { ScrollReveal, MaskedTextReveal, ParallaxImage, VirginCurtainReveal } from '../animations/ScrollReveal';
import { ArrowRight, Sparkles } from 'lucide-react';

interface WildlifeCinematicSequenceProps {
  onNavigate: (path: string) => void;
}

export const WildlifeCinematicSequence: React.FC<WildlifeCinematicSequenceProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 sm:py-36 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 border-t border-[#D9D0C2] overflow-hidden">
      {/* Editorial Section Introduction — Virgin LE asymmetric header */}
      <div className="editorial-split mb-20">
        <div className="flex flex-col justify-center">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#78634B] font-sans font-semibold flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cinematic Wildlife Editorial</span>
            </span>
          </ScrollReveal>

          <MaskedTextReveal delay={0.2} duration={1.1}>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#20221F] leading-[1.1]">
              The Living Theater of Africa.
            </h2>
          </MaskedTextReveal>
        </div>

        <ScrollReveal direction="left" delay={0.3}>
          <p className="text-sm text-[#20221F]/70 font-light leading-relaxed md:pt-8">
            From the misty volcanic sanctuaries of Bwindi's silverbacks to the endless amber plains of the Serengeti where two million wildebeest thunder under the golden horizon.
          </p>
        </ScrollReveal>
      </div>

      {/* Choreographed Editorial Magazine Composition — Virgin LE asymmetric split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-16">
        
        {/* Large Lion Photo — 7 cols with curtain reveal */}
        <div className="lg:col-span-7">
          <ScrollReveal direction="left" delay={0.15}>
            <div className="relative group overflow-hidden bg-[#20221F] shadow-2xl h-[420px] sm:h-[520px]">
              <img
                src="/media/images/Africa/Ulusaba/images/image-17-ulusaba-safari-lions-2.jpg"
                alt="Majestic African Male Lion in Serengeti"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent p-6 sm:p-8 lg:p-10 flex flex-col justify-end text-[#F7F4ED]">
                <ScrollReveal direction="up" delay={0.35}>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#B69A68] font-semibold block mb-2">
                    Serengeti & Maasai Mara
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl font-light mb-3">
                    The Serengeti Lion
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D9D0C2] max-w-lg font-light leading-relaxed">
                    Witness apex predators patrolling ancient river valleys. Our private guides position your custom cruiser for optimal natural lighting and unhurried observation.
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Supporting Column — 5 cols */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
          
          {/* Editorial Text Box */}
          <ScrollReveal direction="up" delay={0.25}>
            <div className="bg-white border border-[#D9D0C2] p-7 sm:p-8 hover-lift">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#78634B] font-semibold block mb-2">
                Pure Wilderness Access
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-light text-[#20221F] mb-3 leading-tight">
                Zero brokers. Official park permits. Guaranteed window seats.
              </h4>
              <p className="text-xs text-[#20221F]/65 font-light leading-relaxed mb-5">
                We believe true luxury is exclusivity and time. Every expedition is architected around wildlife movement patterns, ensuring you are present for the raw, untamed drama of the wild.
              </p>
              <button
                onClick={() => onNavigate('/safari-tours')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#20221F] hover:text-[#B69A68] transition-colors group"
              >
                <span>Discover Signature Safaris</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </ScrollReveal>

          {/* Mountain Gorilla Image — Virgin LE curtain from right */}
          <ScrollReveal direction="right" delay={0.3}>
            <div className="relative group overflow-hidden bg-[#20221F] shadow-xl h-[260px] sm:h-[300px]">
              <img
                src="/images/destinations/uganda-bwindi.jpg"
                alt="Mountain Gorilla Silverback in Bwindi"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#B69A68] font-semibold">
                  Bwindi Impenetrable Forest, Uganda
                </span>
                <h5 className="font-serif text-xl font-light">
                  Mountain Gorilla Silverback
                </h5>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Row 2: Trio of African Icons — Virgin LE masonry pattern */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Card 1: Elephant */}
        <ScrollReveal direction="left" delay={0.2} duration={1.0}>
          <div className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden hover-lift">
            <div className="relative h-64 sm:h-72 overflow-hidden bg-[#20221F]">
                <img
                  src="/media/images/Africa/Finch_Hattons/images/tsavo-red-elephants.jpg"
                  alt="African Bush Elephant Herd"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute top-3 left-3 bg-[#20221F]/80 text-[#F7F4ED] text-[10px] uppercase tracking-wider px-2.5 py-1 backdrop-blur-sm font-semibold">
                  Amboseli & Queen Elizabeth
                </span>
              </div>
            <div className="p-6 sm:p-7">
              <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                Loxodonta africana
              </span>
              <h4 className="font-serif text-2xl font-light text-[#20221F] mb-2 group-hover:text-[#78634B] transition-colors">
                African Bush Elephant
              </h4>
              <p className="text-xs text-[#20221F]/65 font-light leading-relaxed mb-4">
                Family matriarchs leading century-old migration tracks between freshwater marshes and acacia woodlands.
              </p>
              <button
                onClick={() => onNavigate('/plan-trip')}
                className="text-xs uppercase tracking-[0.2em] font-semibold text-[#20221F] hover:text-[#B69A68] flex items-center gap-1.5 transition-colors group"
              >
                <span>Plan Elephant Safari</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Card 2: Leopard */}
        <ScrollReveal direction="up" delay={0.3} duration={1.0}>
          <div className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden hover-lift">
            <div className="relative h-64 sm:h-72 overflow-hidden bg-[#20221F]">
                <img
                  src="/media/images/Africa/Ulusaba/images/image-13-ulusaba-safari-with-guest-_-leopard.jpg"
                  alt="African Leopard in Acacia Tree"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute top-3 left-3 bg-[#20221F]/80 text-[#F7F4ED] text-[10px] uppercase tracking-wider px-2.5 py-1 backdrop-blur-sm font-semibold">
                  Samburu & South Luangwa
                </span>
              </div>
            <div className="p-6 sm:p-7">
              <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                Panthera pardus
              </span>
              <h4 className="font-serif text-2xl font-light text-[#20221F] mb-2 group-hover:text-[#78634B] transition-colors">
                Solitary Leopard
              </h4>
              <p className="text-xs text-[#20221F]/65 font-light leading-relaxed mb-4">
                Master of stealth and golden shadows. Track solitary leopards resting atop towering fever trees and rocky kopjes.
              </p>
              <button
                onClick={() => onNavigate('/destinations')}
                className="text-xs uppercase tracking-[0.2em] font-semibold text-[#20221F] hover:text-[#B69A68] flex items-center gap-1.5 transition-colors group"
              >
                <span>View Wildlife Habitats</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Card 3: Great Migration */}
        <ScrollReveal direction="right" delay={0.4} duration={1.0}>
          <div className="group cursor-pointer bg-white border border-[#D9D0C2] overflow-hidden hover-lift">
            <div className="relative h-64 sm:h-72 overflow-hidden bg-[#20221F]">
                <img
                  src="/media/images/Africa/Mahali_Mzuri/images/mahali-mzuri-sundowners-with-elephants.jpg"
                  alt="Zebras and Wildebeest in Savanna"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute top-3 left-3 bg-[#20221F]/80 text-[#F7F4ED] text-[10px] uppercase tracking-wider px-2.5 py-1 backdrop-blur-sm font-semibold">
                  Serengeti & Mara River
                </span>
              </div>
            <div className="p-6 sm:p-7">
              <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                Equus quagga & Connochaetes
              </span>
              <h4 className="font-serif text-2xl font-light text-[#20221F] mb-2 group-hover:text-[#78634B] transition-colors">
                The Great Migration
              </h4>
              <p className="text-xs text-[#20221F]/65 font-light leading-relaxed mb-4">
                The greatest wildlife spectacle on Earth. Experience dramatic river crossings and predator pursuits up close.
              </p>
              <button
                onClick={() => onNavigate('/travel-packages')}
                className="text-xs uppercase tracking-[0.2em] font-semibold text-[#20221F] hover:text-[#B69A68] flex items-center gap-1.5 transition-colors group"
              >
                <span>Migration Packages</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
