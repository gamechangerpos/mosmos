import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface CinematicHeroProps {
  onExploreClick?: () => void;
  onPlanTripClick?: () => void;
  onHeaderVisibleChange?: (visible: boolean) => void;
}

// Rotating hero videos exclusively from extracted reference footage
const HERO_VIDEOS = [
  {
    src: '/media/videos/Virgin_Limited_Edition_Showreel_Hero_Video.mp4',
    label: 'African Wilderness',
    subtitle: 'The Great Migration & Savanna',
  },
  {
    src: '/media/videos/Mahali_Mzuri_Hero_Video.mp4',
    label: 'Mahali Mzuri',
    subtitle: 'Maasai Mara, Kenya',
  },
  {
    src: '/media/videos/Finch_Hattons_Hero_Video.mp4',
    label: 'Finch Hattons',
    subtitle: 'Tsavo, Kenya',
  },
  {
    src: '/media/videos/Kasbah_Tamadot_Hero_Video.mp4',
    label: 'Kasbah Tamadot',
    subtitle: 'Atlas Mountains, Morocco',
  },
  {
    src: '/media/videos/Ulusaba_Hero_Video.mp4',
    label: 'Ulusaba Reserve',
    subtitle: 'Sabi Sand, South Africa',
  },
  {
    src: '/media/videos/Mont_Rochelle_Hero_Video.mp4',
    label: 'Mont Rochelle',
    subtitle: 'Franschhoek, South Africa',
  },
];

const ROTATION_INTERVAL = 12000; // 12 seconds per video

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onExploreClick,
  onPlanTripClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Initial curtain reveal
  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate videos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Play/pause videos on index change
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === currentIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentIndex]);

  const currentVideo = HERO_VIDEOS[currentIndex];

  return (
    <section className="relative w-full h-[100svh] min-h-[600px] bg-[#0f0f0f] overflow-hidden select-none">
      {/* Virgin LE Curtain Overlay — slides away to reveal */}
      <div
        className={`absolute inset-0 z-20 bg-[#F7F4ED] transition-transform duration-[1500ms] ${
          isRevealed ? 'translate-x-[-110%]' : 'translate-x-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)' }}
      />

      {/* Video Stack — crossfade between videos */}
      {HERO_VIDEOS.map((video, i) => (
        <video
          key={video.src}
          ref={(el) => { videoRefs.current[i] = el; }}
          src={video.src}
          autoPlay={i === 0}
          muted
          playsInline
          loop
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${
            i === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: isRevealed ? 'scale(1)' : 'scale(1.08)',
            transition: 'transform 1.5s cubic-bezier(0.19, 1, 0.22, 1)',
          }}
        />
      ))}

      {/* Atmospheric Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-black/35 pointer-events-none" />

      {/* Center Copy — Virgin LE editorial typography */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none transition-all duration-[1800ms] ${
          isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)', transitionDelay: '0.6s' }}
      >
        {/* Overline */}
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#B69A68] font-sans font-semibold mb-4">
          Luxury African Safaris & Global Expeditions
        </span>

        {/* Main Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light tracking-[0.08em] uppercase text-white leading-[0.95] mb-4">
          MOS MOS{' '}
          <span className="font-light italic text-[#D9D0C2] tracking-[0.12em]">Safaris</span>
        </h1>

        {/* Subtitle — rotates with video */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#D9D0C2] font-light tracking-wide mb-8"
          >
            {currentVideo.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* CTA Buttons — pointer-events enabled */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pointer-events-auto">
          <button
            onClick={onExploreClick}
            className="px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-white hover:text-[#20221F] transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            <span>Explore Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onPlanTripClick}
            className="px-8 py-3.5 bg-[#B69A68] text-[#20221F] text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#a68a58] transition-all duration-300 cursor-pointer"
          >
            Plan Your Safari
          </button>
        </div>
      </div>

      {/* Video Navigation Indicators — Virgin LE dot style */}
      <div className="absolute bottom-24 sm:bottom-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5 pointer-events-auto">
        {HERO_VIDEOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`transition-all duration-500 cursor-pointer rounded-full ${
              i === currentIndex
                ? 'w-8 h-2 bg-[#B69A68]'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Video ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator — Virgin LE style */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/60 font-sans">
          Scroll to Explore
        </span>
        <ChevronDown className="w-4 h-4 text-white/50 animate-bounce-subtle" />
      </div>
    </section>
  );
};
