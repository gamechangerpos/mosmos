import React from 'react';
import { ShieldCheck, HeartHandshake, Eye, Award, Compass, Trees, CheckCircle2 } from 'lucide-react';
import { ScrollReveal, MaskedTextReveal, ParallaxImage } from '../components/animations/ScrollReveal';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-20 bg-[#F7F4ED] overflow-x-hidden">
      {/* Header */}
      <div className="bg-[#20221F] text-[#F7F4ED] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#343C32]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="text-xs uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-2">
              The MOS MOS Story
            </span>
          </ScrollReveal>
          <MaskedTextReveal delay={0.2}>
            <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#F7F4ED] mb-4">
              Wilderness, Heritage & Trust
            </h1>
          </MaskedTextReveal>
          <ScrollReveal direction="left" delay={0.3}>
            <p className="text-sm sm:text-base text-[#D9D0C2] font-light max-w-2xl leading-relaxed">
              Founded in Uganda, MOS MOS Safaris was created to bring travelers into deep, respectful communion with the wild rhythms of the African continent and world-heritage destinations.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Story Section: Image and Text Enter from Opposing Directions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Text enters from Left */}
          <div className="lg:col-span-6 space-y-5 text-sm text-[#20221F]/80 font-light leading-relaxed">
            <ScrollReveal direction="left" delay={0.15}>
              <span className="text-xs uppercase tracking-[0.25em] text-[#78634B] font-semibold block mb-2">
                Our Guiding Ethos
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#20221F] mb-4">
                Born of the Savanna, Crafted for Discerning Travelers.
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.25}>
              <p>
                "MOS MOS" embodies the spirit of unhurried exploration and profound connection — celebrating the sacred harmony between the earth, wildlife, local indigenous communities, and the humble traveler who enters their realm.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.35}>
              <p>
                Too many commercial safaris reduce wildlife to checklist drive-bys. We believe that sitting quietly in the mist of Bwindi with an 800-pound silverback gorilla, or floating in silence as dawn mist burns off the Serengeti, is a spiritual privilege that demands reverence, patience, and impeccable ethics.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.45}>
              <p>
                Every expedition we build supports direct park ranger livelihoods, local community schools on park borders, and verified reforestation corridors across East Africa.
              </p>
            </ScrollReveal>
          </div>

          {/* Photograph enters from Right with Parallax */}
          <div className="lg:col-span-6">
            <ScrollReveal direction="right" delay={0.2} duration={1.2}>
              <div className="relative">
                <div className="h-[420px] shadow-2xl overflow-hidden bg-[#20221F]">
                  <img
                    src="/media/images/Africa/Finch_Hattons/images/chyulu-cloudy-1.jpg"
                    alt="African Savanna Sunrise"
                    className="w-full h-full object-cover"
                  />
                </div>
                <ScrollReveal direction="up" delay={0.5} className="absolute -bottom-6 -left-6 hidden sm:block">
                  <div className="bg-[#20221F] text-[#F7F4ED] p-6 max-w-xs shadow-xl border border-white/10">
                    <span className="font-serif text-2xl font-light text-[#B69A68] block mb-1">
                      100% Direct
                    </span>
                    <p className="text-[11px] text-[#D9D0C2] leading-tight font-light">
                      Partnered directly with the Uganda Wildlife Authority (UWA) & Rwanda Development Board (RDB).
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Pillars with Staggered Multi-directional Reveals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 border-t border-[#D9D0C2]">
          <ScrollReveal direction="left" delay={0.15}>
            <div className="bg-white p-8 border border-[#D9D0C2] h-full shadow-xs">
              <Trees className="w-8 h-8 text-[#78634B] mb-4" />
              <h3 className="font-serif text-2xl font-light text-[#20221F] mb-3">
                Conservation Integrity
              </h3>
              <p className="text-xs text-[#20221F]/70 leading-relaxed font-light">
                We never support unethical animal interactions, unregulated off-roading, or artificial feeding. All gorilla permits contribute directly to mountain gorilla population recovery.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.25}>
            <div className="bg-white p-8 border border-[#D9D0C2] h-full shadow-xs">
              <Compass className="w-8 h-8 text-[#78634B] mb-4" />
              <h3 className="font-serif text-2xl font-light text-[#20221F] mb-3">
                Naturalist Field Guiding
              </h3>
              <p className="text-xs text-[#20221F]/70 leading-relaxed font-light">
                Our guides are senior naturalists, ornithologists, and trackers with minimum 10 years experience in the field who know animal behavior, bird calls, and savanna geology intimately.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.35}>
            <div className="bg-white p-8 border border-[#D9D0C2] h-full shadow-xs">
              <HeartHandshake className="w-8 h-8 text-[#78634B] mb-4" />
              <h3 className="font-serif text-2xl font-light text-[#20221F] mb-3">
                Community Direct Benefit
              </h3>
              <p className="text-xs text-[#20221F]/70 leading-relaxed font-light">
                A fixed portion of every safari booking supports indigenous porter cooperatives in Bwindi and clean water borehole maintenance in Maasai conservancies.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* CTA */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="bg-[#20221F] text-[#F7F4ED] p-10 text-center border border-[#343C32] mt-12 shadow-xl">
            <h3 className="font-serif text-3xl font-light mb-3">
              Ready to Plan Your Expedition?
            </h3>
            <p className="text-xs text-[#D9D0C2] max-w-md mx-auto mb-6 font-light">
              Speak directly with our regional safari directors to design your dream journey.
            </p>
            <button
              onClick={() => onNavigate('/plan-trip')}
              className="px-8 py-3 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors shadow cursor-pointer"
            >
              Start Planning
            </button>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};
