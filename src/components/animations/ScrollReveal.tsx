import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';

// Directional options — enhanced with Virgin LE curtain
export type RevealDirection =
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'bottom-right'
  | 'top-left'
  | 'mask-up'
  | 'mask-left'
  | 'mask-right'
  | 'curtain'
  | 'zoom-in'
  | 'none';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
  once?: boolean;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.85,
  className = '',
  distance = 60,
  once = true,
  threshold = 0.02
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once,
    amount: threshold
  });
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    // Failsafe: if element hasn't triggered inView within 500ms, reveal it so it never stays invisible
    const timer = setTimeout(() => setForceVisible(true), 500 + delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  const isInView = inView || forceVisible;

  // Calculate initial and animate transform offsets
  const getVariants = () => {
    switch (direction) {
      case 'left':
        return {
          hidden: { opacity: 0, x: -distance, filter: 'blur(4px)' },
          visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: distance, filter: 'blur(4px)' },
          visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
        };
      case 'up':
        return {
          hidden: { opacity: 0, y: distance, filter: 'blur(4px)' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
        };
      case 'down':
        return {
          hidden: { opacity: 0, y: -distance, filter: 'blur(4px)' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
        };
      case 'bottom-right':
        return {
          hidden: { opacity: 0, x: distance * 0.7, y: distance * 0.7 },
          visible: { opacity: 1, x: 0, y: 0 }
        };
      case 'top-left':
        return {
          hidden: { opacity: 0, x: -distance * 0.7, y: -distance * 0.7 },
          visible: { opacity: 1, x: 0, y: 0 }
        };
      case 'zoom-in':
        return {
          hidden: { opacity: 0, scale: 0.92 },
          visible: { opacity: 1, scale: 1 }
        };
      case 'mask-up':
        return {
          hidden: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)', y: 30 },
          visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0 }
        };
      case 'mask-left':
        return {
          hidden: { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' },
          visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }
        };
      case 'mask-right':
        return {
          hidden: { opacity: 0, clipPath: 'inset(0% 0% 0% 100%)' },
          visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }
        };
      case 'curtain':
        return {
          hidden: { opacity: 0, clipPath: 'inset(0% 50% 0% 50%)', scale: 0.98 },
          visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }
        };
      case 'none':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.19, 1, 0.22, 1] // Luxury cubic-bezier deceleration
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * MaskedTextReveal: Text emerges from behind an invisible clipping container.
 * Gives an award-winning editorial magazine feel.
 */
interface MaskedTextProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const MaskedTextReveal: React.FC<MaskedTextProps> = ({
  children,
  delay = 0,
  duration = 0.9,
  className = '',
  as = 'div'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className={`overflow-hidden inline-block ${className}`}>
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/**
 * WordByWordReveal: Animates text word-by-word with subtle staggered entry.
 */
interface WordByWordProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export const WordByWordReveal: React.FC<WordByWordProps> = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.04
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const words = text.split(' ');

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-1.5 ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block py-0.5">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              duration: 0.7,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

/**
 * ParallaxImage: Controlled subtle vertical parallax with smooth scaling on reveal.
 * Enhanced with Virgin LE's 0.12x parallax factor and scale 1.08 → 1.0
 */
interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  speed?: number; // -30 to 30px
  maskType?: 'curtain' | 'left-to-right' | 'bottom-to-top' | 'none';
  delay?: number;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  speed = 25,
  maskType = 'bottom-to-top',
  delay = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Virgin LE parallax: subtle 0.12x factor
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);

  const getMaskVariants = () => {
    switch (maskType) {
      case 'none':
        return {
          hidden: { opacity: 1, clipPath: 'none' },
          visible: { opacity: 1, clipPath: 'none' }
        };
      case 'left-to-right':
        return {
          hidden: { clipPath: 'inset(0% 100% 0% 0%)' },
          visible: { clipPath: 'inset(0% 0% 0% 0%)' }
        };
      case 'curtain':
        return {
          hidden: { clipPath: 'inset(0% 50% 0% 50%)' },
          visible: { clipPath: 'inset(0% 0% 0% 0%)' }
        };
      case 'bottom-to-top':
      default:
        return {
          hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
          visible: { clipPath: 'inset(0% 0% 0% 0%)' }
        };
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={maskType === 'none' ? 'visible' : 'hidden'}
      animate="visible"
      variants={getMaskVariants()}
      transition={{
        duration: 1.25,
        delay,
        ease: [0.19, 1, 0.22, 1]
      }}
      className={`relative overflow-hidden bg-[#20221F] ${containerClassName}`}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className={`w-full h-full object-cover transition-opacity duration-700 ${className}`}
      />
    </motion.div>
  );
};

/**
 * VirginCurtainReveal: The signature Virgin LE effect.
 * A solid-color overlay slides away via translateX while the content
 * beneath scales smoothly. Content is always kept at opacity: 1 so no
 * blank white frames can ever get stuck.
 */
interface VirginCurtainRevealProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  overlayColor?: string;
  className?: string;
  delay?: number;
}

export const VirginCurtainReveal: React.FC<VirginCurtainRevealProps> = ({
  children,
  direction = 'left',
  overlayColor = '#F7F4ED',
  className = '',
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsRevealed(true), delay * 1000);
      return () => clearTimeout(timer);
    } else {
      // Guaranteed safety fallback: reveal after 300ms even if observer hasn't triggered
      const fallback = setTimeout(() => setIsRevealed(true), 300 + delay * 1000);
      return () => clearTimeout(fallback);
    }
  }, [isInView, delay]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* The sliding overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none transition-transform duration-[1000ms]"
        style={{
          backgroundColor: overlayColor,
          transform: isRevealed
            ? `translateX(${direction === 'left' ? '-110%' : '110%'})`
            : 'translateX(0)',
          transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
        }}
      />
      {/* The content that scales - ALWAYS opacity 1 */}
      <div
        className="transition-all duration-[1000ms] w-full h-full"
        style={{
          opacity: 1,
          transform: isRevealed ? 'scale(1)' : 'scale(1.04)',
          transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
        }}
      >
        {children}
      </div>
    </div>
  );
};
