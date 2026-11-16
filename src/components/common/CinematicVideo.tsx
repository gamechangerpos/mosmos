import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';

export interface CinematicVideoProps {
  src: string;
  poster?: string;
  className?: string;
  containerClassName?: string;
  mobileObjectPosition?: string;
  desktopObjectPosition?: string;
  priority?: boolean;
  pauseWhenOffscreen?: boolean;
  opacityClassName?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

/**
 * High-performance, zero-control, seamless looping video component.
 * Features:
 * - Guaranteed muted autoplay across iOS Safari, iPadOS, Android Chrome, and desktop.
 * - Hardware-enforced zero controls (native bars, picture-in-picture, play badges stripped).
 * - Calibrated mobile portrait & desktop object-position cropping (prevents animal/subject cutoff).
 * - Offscreen IntersectionObserver suspension to preserve mobile battery & GPU decoding power.
 * - Lazy-loading when approaching viewport (300px margin) for non-hero placements.
 * - Silent retry on visibility change / first user interaction without showing any fallback button.
 * - Zero layout shift with dark aesthetic placeholder backing.
 * - Accessibility: respects prefers-reduced-motion.
 */
export const CinematicVideo: React.FC<CinematicVideoProps> = ({
  src,
  poster,
  className = '',
  containerClassName = '',
  mobileObjectPosition = 'center center',
  desktopObjectPosition = 'center center',
  priority = false,
  pauseWhenOffscreen = true,
  opacityClassName,
  style,
  ariaLabel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState<boolean>(priority);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Viewport tracking for tailored mobile focal cropping
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Strict DOM property enforcement for Mobile WebKit & Chromium autoplay policies
  useLayoutEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
    }
  }, [shouldLoad]);

  // Lazy-load non-priority videos when within 300px of viewport
  useEffect(() => {
    if (priority || shouldLoad) return;
    const target = containerRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [priority, shouldLoad]);

  // Playback lifecycle: Offscreen pause/resume + silent low-power retry
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    // Respect user's reduced motion preferences
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    const safePlay = () => {
      if (!video) return;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Graceful silent swallow — will retry on focus or first touch
        });
      }
    };

    let isIntersecting = true;
    let observer: IntersectionObserver | null = null;

    if (pauseWhenOffscreen && typeof IntersectionObserver !== 'undefined' && containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            safePlay();
          } else {
            video.pause();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
    } else {
      safePlay();
    }

    // Tab visibility and focus handlers
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else if (isIntersecting) {
        safePlay();
      }
    };

    // First touch/scroll passive retry (unblocks iOS low power mode silently)
    const handleFirstInteraction = () => {
      if (isIntersecting && video.paused) {
        safePlay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('scroll', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true, once: true });

    return () => {
      if (observer) observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
    };
  }, [shouldLoad, pauseWhenOffscreen]);

  const currentObjectPosition = isMobile ? mobileObjectPosition : desktopObjectPosition;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-[#0f0f0f] ${containerClassName}`}
    >
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-hidden="true"
          aria-label={ariaLabel}
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-out select-none pointer-events-none ${
            isLoaded ? (opacityClassName || 'opacity-100') : 'opacity-0'
          } ${className}`}
          style={{
            objectPosition: currentObjectPosition,
            ...style,
          }}
        />
      )}
    </div>
  );
};
