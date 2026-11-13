import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, X, Sparkles, Compass, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WildlifeScrollExperienceProps {
  onNavigate: (path: string) => void;
}

type AnimalType = 'elephant' | 'giraffe' | 'lion' | 'gorilla';

interface WildlifeCardData {
  id: AnimalType;
  name: string;
  species: string;
  image: string;
  badge: string;
  greeting: string;
  message: string;
  primaryActionLabel: string;
  primaryActionPath: string;
  secondaryActionLabel?: string;
  secondaryActionPath?: string;
  side: 'left' | 'right';
}

const WILDLIFE_COMPANIONS: Record<AnimalType, WildlifeCardData> = {
  elephant: {
    id: 'elephant',
    name: 'African Bush Elephant',
    species: 'Loxodonta africana',
    image: '/media/images/Africa/Finch_Hattons/images/finch-hattons-game-drive-with-elephants.jpg',
    badge: 'Savanna Giant',
    greeting: 'Make your appointment or book your next tour!',
    message: 'Jambo! Our local safari architects secure your official dates and direct wilderness permits.',
    primaryActionLabel: 'Make Appointment',
    primaryActionPath: '/plan-trip',
    secondaryActionLabel: 'View Gallery',
    secondaryActionPath: '/destinations',
    side: 'left'
  },
  giraffe: {
    id: 'giraffe',
    name: 'Rothschild Giraffe',
    species: 'Giraffa camelopardalis',
    image: '/media/images/Africa/Ulusaba/images/image-15-ulusaba-walking-safari-with-guest-_-giraffe-3.jpg',
    badge: 'Savanna Sentinel',
    greeting: 'Spot the Great Migration & Big Five!',
    message: 'Witness 2 million wildebeest and zebras traverse the endless plains of the Serengeti and Mara.',
    primaryActionLabel: 'Explore Tours',
    primaryActionPath: '/safari-tours',
    secondaryActionLabel: 'Plan Trip',
    secondaryActionPath: '/plan-trip',
    side: 'right'
  },
  lion: {
    id: 'lion',
    name: 'East African Lion',
    species: 'Panthera leo',
    image: '/media/images/Africa/Ulusaba/images/image-17-ulusaba-safari-lions-2.jpg',
    badge: 'King of the Savanna',
    greeting: 'Stay somewhere extraordinary tonight.',
    message: 'Relax in handpicked five-star safari lodges and luxury tented camps directly inside wildlife corridors.',
    primaryActionLabel: 'Discover Lodges',
    primaryActionPath: '/stays',
    secondaryActionLabel: 'Inquire',
    secondaryActionPath: '/plan-trip',
    side: 'left'
  },
  gorilla: {
    id: 'gorilla',
    name: 'Mountain Gorilla Silverback',
    species: 'Gorilla beringei beringei',
    image: '/images/destinations/uganda-bwindi.jpg',
    badge: 'Official Primate Protection',
    greeting: 'Guaranteed Gorilla Trekking Permits!',
    message: 'Only ~1,063 mountain gorillas remain on Earth. We secure official permits directly with UWA and RDB.',
    primaryActionLabel: 'Secure Permits',
    primaryActionPath: '/plan-trip',
    secondaryActionLabel: 'Uganda Guide',
    secondaryActionPath: '/destinations/uganda',
    side: 'right'
  }
};

export const WildlifeScrollExperience: React.FC<WildlifeScrollExperienceProps> = ({ onNavigate }) => {
  const [activeAnimal, setActiveAnimal] = useState<AnimalType | null>(null);
  const [dismissed, setDismissed] = useState<Record<AnimalType, boolean>>({
    elephant: false,
    giraffe: false,
    lion: false,
    gorilla: false
  });
  const [spottedAnimals, setSpottedAnimals] = useState<AnimalType[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Active scroll depth triggers
      if (scrollY >= 500 && scrollY < 1600) {
        if (!dismissed.elephant) setActiveAnimal('elephant');
        markSpotted('elephant');
      } else if (scrollY >= 2100 && scrollY < 3200) {
        if (!dismissed.giraffe) setActiveAnimal('giraffe');
        markSpotted('giraffe');
      } else if (scrollY >= 3300 && scrollY < 4400) {
        if (!dismissed.lion) setActiveAnimal('lion');
        markSpotted('lion');
      } else if (scrollY >= 4500 && scrollY < 5700) {
        if (!dismissed.gorilla) setActiveAnimal('gorilla');
        markSpotted('gorilla');
      } else {
        setActiveAnimal(null);
      }
    };

    const markSpotted = (animal: AnimalType) => {
      setSpottedAnimals((prev) => (prev.includes(animal) ? prev : [...prev, animal]));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  const handleDismiss = (animal: AnimalType, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed((prev) => ({ ...prev, [animal]: true }));
    setActiveAnimal(null);
  };

  const handleReopen = (animal: AnimalType) => {
    setDismissed((prev) => ({ ...prev, [animal]: false }));
    setActiveAnimal(animal);
  };

  const current = activeAnimal ? WILDLIFE_COMPANIONS[activeAnimal] : null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <AnimatePresence>
        {current && !dismissed[current.id] && (
          <motion.div
            key={current.id}
            initial={{
              x: current.side === 'left' ? -380 : 380,
              opacity: 0,
              scale: 0.94
            }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1
            }}
            exit={{
              x: current.side === 'left' ? -380 : 380,
              opacity: 0,
              scale: 0.94
            }}
            transition={{
              duration: 0.85,
              ease: [0.19, 1, 0.22, 1]
            }}
            className={`pointer-events-auto absolute bottom-12 sm:bottom-16 ${
              current.side === 'left' ? 'left-4 sm:left-8' : 'right-4 sm:right-8'
            } max-w-[340px] sm:max-w-[400px] bg-[#20221F] text-[#F7F4ED] rounded-xl border border-[#B69A68]/70 shadow-2xl overflow-hidden backdrop-blur-md`}
          >
            {/* Real Wildlife Photography Card Header */}
            <div className="relative h-44 sm:h-48 overflow-hidden group">
              <img
                src={current.image}
                alt={current.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20221F] via-[#20221F]/30 to-black/40" />

              {/* Close Button */}
              <button
                onClick={(e) => handleDismiss(current.id, e)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-[#F7F4ED] transition-colors z-10 cursor-pointer"
                aria-label="Dismiss wildlife alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Badge & Species */}
              <div className="absolute top-3 left-3 flex flex-col gap-0.5 z-10">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B69A68] font-bold bg-black/70 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#B69A68]/30">
                  {current.badge}
                </span>
              </div>

              {/* Animal Name over photo */}
              <div className="absolute bottom-2.5 left-4 right-4">
                <h3 className="font-serif text-xl sm:text-2xl text-[#F7F4ED] font-light leading-none">
                  {current.name}
                </h3>
                <span className="text-[10px] italic text-[#D9D0C2]/80 font-serif">
                  {current.species}
                </span>
              </div>
            </div>

            {/* Editorial Content / Speech Invitation */}
            <div className="p-4 sm:p-5 pt-2">
              <p className="font-serif text-base sm:text-lg text-[#F7F4ED] font-light leading-snug mb-1.5">
                "{current.greeting}"
              </p>
              <p className="text-xs text-[#D9D0C2]/85 font-light leading-relaxed mb-4">
                {current.message}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate(current.primaryActionPath)}
                  className="flex-1 py-2.5 px-3.5 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] font-bold text-[11px] uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{current.primaryActionLabel}</span>
                </button>
                {current.secondaryActionLabel && (
                  <button
                    onClick={() => onNavigate(current.secondaryActionPath!)}
                    className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-[#F7F4ED] text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    {current.secondaryActionLabel}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safari Wildlife Spotted Pill at bottom */}
      {spottedAnimals.length > 0 && (
        <div className="pointer-events-auto absolute bottom-3 left-4 sm:left-8 bg-[#20221F]/95 backdrop-blur-md text-[#F7F4ED] border border-[#B69A68]/40 px-3.5 py-1.5 rounded-full flex items-center gap-2.5 shadow-xl text-xs z-30">
          <span className="text-[10px] uppercase tracking-wider text-[#B69A68] font-bold hidden sm:inline">
            Wildlife Encounters:
          </span>
          <div className="flex items-center gap-2">
            {(['elephant', 'giraffe', 'lion', 'gorilla'] as AnimalType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleReopen(type)}
                title={`Summon ${WILDLIFE_COMPANIONS[type].name}`}
                className={`text-base transition-all duration-200 cursor-pointer ${
                  spottedAnimals.includes(type)
                    ? 'opacity-100 hover:scale-125'
                    : 'opacity-25 hover:opacity-50'
                }`}
              >
                {type === 'elephant' && '🐘'}
                {type === 'giraffe' && '🦒'}
                {type === 'lion' && '🦁'}
                {type === 'gorilla' && '🦍'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
