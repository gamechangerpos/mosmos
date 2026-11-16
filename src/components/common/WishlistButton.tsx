import React, { useState, useEffect } from 'react';
import { Heart, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalService } from '../../services/portalService';
import { WishlistItem } from '../../types';

interface WishlistButtonProps {
  item: {
    itemId: string;
    itemType: 'package' | 'destination' | 'tour' | 'stay';
    slug: string;
    title: string;
    heroImage: string;
    location?: string;
    priceNote?: string;
  };
  variant?: 'button' | 'icon' | 'badge';
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  item,
  variant = 'button',
  className = ''
}) => {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Check initial state
  useEffect(() => {
    let isMounted = true;

    const checkWishlist = async () => {
      if (user) {
        try {
          const list = await PortalService.getWishlist(user.uid);
          if (isMounted) {
            setIsInWishlist(list.some(i => i.itemId === item.itemId));
          }
        } catch {
          // silent
        }
      } else {
        // Guest mode fallback via localStorage
        try {
          const guest = localStorage.getItem('mos_mos_guest_wishlist');
          if (guest) {
            const list: WishlistItem[] = JSON.parse(guest);
            if (isMounted) {
              setIsInWishlist(list.some(i => i.itemId === item.itemId));
            }
          }
        } catch {
          // silent
        }
      }
    };

    checkWishlist();
    return () => { isMounted = false; };
  }, [user, item.itemId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);

    const willAdd = !isInWishlist;
    setIsInWishlist(willAdd);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);

    if (user) {
      try {
        await PortalService.toggleWishlistItem(user.uid, {
          customerId: user.uid,
          itemType: item.itemType,
          itemId: item.itemId,
          slug: item.slug,
          title: item.title,
          heroImage: item.heroImage,
          location: item.location,
          priceNote: item.priceNote
        });
      } catch (err) {
        console.warn('[WishlistButton] toggle error:', err);
      }
    } else {
      // Guest storage
      try {
        const guest = localStorage.getItem('mos_mos_guest_wishlist');
        let list: WishlistItem[] = guest ? JSON.parse(guest) : [];
        if (willAdd) {
          list.unshift({
            id: `guest_wish_${Date.now()}`,
            customerId: 'guest',
            itemType: item.itemType,
            itemId: item.itemId,
            slug: item.slug,
            title: item.title,
            heroImage: item.heroImage,
            location: item.location,
            priceNote: item.priceNote,
            addedAt: new Date().toISOString()
          });
        } else {
          list = list.filter(i => i.itemId !== item.itemId);
        }
        localStorage.setItem('mos_mos_guest_wishlist', JSON.stringify(list));
      } catch (err) {
        console.warn('[WishlistButton] guest storage error:', err);
      }
    }
  };

  // 1. Icon-only floating circle (ideal for media cards or top bar corners)
  if (variant === 'icon') {
    return (
      <div className="relative inline-block">
        <button
          onClick={handleToggle}
          title={isInWishlist ? 'Remove from Wishlist' : 'Save to Safari Wishlist'}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer ${
            isInWishlist
              ? 'bg-[#B69A68] text-[#20221F] shadow-lg scale-105'
              : 'bg-black/40 border border-white/20 text-white hover:bg-black/70 hover:text-[#B69A68]'
          } ${isAnimating ? 'scale-125' : ''} ${className}`}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isInWishlist ? 'fill-current text-[#20221F]' : 'text-current'
            }`}
          />
        </button>

        {showFeedback && (
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#20221F] text-[#F7F4ED] text-[10px] tracking-wider px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none z-30 animate-fadeIn">
            {isInWishlist ? 'Saved' : 'Removed'}
          </span>
        )}
      </div>
    );
  }

  // 2. Compact Badge
  if (variant === 'badge') {
    return (
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium rounded-full transition-all cursor-pointer ${
          isInWishlist
            ? 'bg-[#B69A68] text-[#20221F]'
            : 'bg-black/30 border border-white/15 text-white/90 hover:bg-black/50'
        } ${className}`}
      >
        <Heart className={`w-3 h-3 ${isInWishlist ? 'fill-current' : ''}`} />
        <span>{isInWishlist ? 'Saved' : 'Save'}</span>
      </button>
    );
  }

  // 3. Primary Full Button (for Detail Pages)
  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        className={`px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer flex items-center gap-2.5 border ${
          isInWishlist
            ? 'bg-[#B69A68] text-[#20221F] border-[#B69A68] shadow-md'
            : 'border-white/30 text-white hover:bg-white hover:text-[#20221F] backdrop-blur-sm bg-black/20'
        } ${isAnimating ? 'scale-[1.02]' : ''} ${className}`}
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-300 ${
            isInWishlist ? 'fill-[#20221F] text-[#20221F] scale-110' : 'text-current'
          }`}
        />
        <span>
          {isInWishlist ? 'Saved in Wishlist' : 'Save Experience'}
        </span>
      </button>

      {showFeedback && (
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-[#20221F] text-[#B69A68] border border-[#B69A68]/30 text-[10px] uppercase tracking-wider px-3 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none z-30 flex items-center gap-1.5 animate-fadeIn">
          <Check className="w-3 h-3 text-[#B69A68]" />
          <span>{isInWishlist ? 'Added to Client Portal Wishlist' : 'Removed from Wishlist'}</span>
        </div>
      )}
    </div>
  );
};
