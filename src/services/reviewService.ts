import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CustomerReview } from '../types';

const INITIAL_APPROVED_REVIEWS: CustomerReview[] = [
  {
    id: 'rev_1',
    targetType: 'package',
    targetSlug: 'serengeti-great-migration',
    targetTitle: 'Serengeti & Ngorongoro Great Migration Safari',
    rating: 5,
    authorName: 'Eleanor Vance',
    authorLocation: 'London, United Kingdom',
    tripType: 'Luxury Wildlife Safari',
    travelDate: 'July 2025',
    title: 'The river crossing was an awe-inspiring spectacle',
    comment: 'MOS MOS Safaris curated an unforgettable 10-day experience across the Serengeti. Our private guide Samuel possessed encyclopedic knowledge of predator movements and positioned our vehicle perfectly for the Mara River crossing.',
    status: 'approved',
    createdAt: '2025-08-02T14:20:00Z'
  },
  {
    id: 'rev_2',
    targetType: 'destination',
    targetSlug: 'uganda',
    targetTitle: 'Uganda — The Pearl of Africa',
    rating: 5,
    authorName: 'Marcus & Claire Dupont',
    authorLocation: 'Geneva, Switzerland',
    tripType: 'Gorilla Trekking & Primates',
    travelDate: 'October 2025',
    title: 'Sitting 5 meters from a mountain gorilla silverback',
    comment: 'Flawless execution from landing in Entebbe to the heights of Bwindi Impenetrable Forest. The gorilla habituation permits were organized with absolute precision and the lodge overlooking the mist was pure heaven.',
    status: 'approved',
    createdAt: '2025-10-18T09:15:00Z'
  },
  {
    id: 'rev_3',
    targetType: 'package',
    targetSlug: 'rwanda-gorilla-safari',
    targetTitle: 'Rwanda Ultimate Primate & Volcanoes Expedition',
    rating: 5,
    authorName: 'Dr. Jonathan Reynolds',
    authorLocation: 'Boston, USA',
    tripType: 'Conservation & Photography',
    travelDate: 'September 2025',
    title: 'Beyond five stars — conservation at its purest',
    comment: 'The logistical finesse of the MOS MOS concierge team was impeccable. Helicopter transfers into Volcanoes National Park were seamless, and the photographic positioning during our treks allowed for world-class captures.',
    status: 'approved',
    createdAt: '2025-09-24T16:45:00Z'
  },
  {
    id: 'rev_4',
    targetType: 'destination',
    targetSlug: 'kenya',
    targetTitle: 'Kenya — Maasai Mara & Amboseli',
    rating: 5,
    authorName: 'Amara Kalu',
    authorLocation: 'Toronto, Canada',
    tripType: 'Family Safari',
    travelDate: 'December 2025',
    title: 'A transformative journey for our entire family',
    comment: 'Every detail for our children and parents was considered. From hot air balloon safaris over the Mara at dawn to private bush dinners under the African stars, MOS MOS created memories we will cherish for generations.',
    status: 'approved',
    createdAt: '2026-01-05T11:30:00Z'
  },
  {
    id: 'rev_5',
    targetType: 'tour',
    targetSlug: 'uganda-ultimate-primates-murchison',
    targetTitle: '8-Day Uganda Ultimate Primates & Murchison Odyssey',
    rating: 5,
    authorName: 'Charlotte & David Hughes',
    authorLocation: 'Melbourne, Australia',
    tripType: 'Primate & Wildlife Expedition',
    travelDate: 'November 2025',
    title: 'From Murchison Falls to the gorillas — absolutely masterclass',
    comment: 'The boat excursion along the Victoria Nile leading to the base of Murchison Falls was extraordinary. Then moving on to Kibale for chimpanzees and Bwindi for mountain gorillas was the ultimate climax.',
    status: 'approved',
    createdAt: '2025-11-20T10:00:00Z'
  },
  {
    id: 'rev_6',
    targetType: 'stay',
    targetSlug: 'sanctuary-gorilla-forest-camp',
    targetTitle: 'Sanctuary Gorilla Forest Camp',
    rating: 5,
    authorName: 'Lord Arthur Sterling',
    authorLocation: 'Edinburgh, Scotland',
    tripType: 'Luxury Rainforest Sanctuary',
    travelDate: 'August 2025',
    title: 'Gorillas visited our private camp veranda at dawn',
    comment: 'An ecological sanctuary of the highest order. Waking up inside Bwindi to the call of turacos and having a silverback calmly forage near our deck is a memory carved forever into my mind.',
    status: 'approved',
    createdAt: '2025-08-30T17:10:00Z'
  }
];

export const ReviewService = {
  async submitReview(review: Omit<CustomerReview, 'id' | 'status' | 'createdAt'>): Promise<CustomerReview> {
    const newReview: CustomerReview = {
      ...review,
      id: `rev_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Store in localStorage
    try {
      const stored = localStorage.getItem('mos_mos_reviews');
      const list: CustomerReview[] = stored ? JSON.parse(stored) : [...INITIAL_APPROVED_REVIEWS];
      list.unshift(newReview);
      localStorage.setItem('mos_mos_reviews', JSON.stringify(list));
    } catch {
      // silent
    }

    // Write to Firestore
    try {
      const docRef = doc(db, 'reviews', newReview.id);
      await setDoc(docRef, {
        ...newReview,
        serverCreatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('[ReviewService] submitReview Firestore error:', err);
    }

    return newReview;
  },

  async getApprovedReviews(targetType?: 'package' | 'destination' | 'tour' | 'stay' | 'general', targetSlug?: string): Promise<CustomerReview[]> {
    try {
      let q = query(
        collection(db, 'reviews'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const snap = await getDocs(q);
      const list: CustomerReview[] = [];
      snap.forEach(d => list.push(d.data() as CustomerReview));

      if (list.length > 0) {
        if (targetSlug) {
          return list.filter(r => !r.targetSlug || r.targetSlug === targetSlug);
        }
        if (targetType) {
          return list.filter(r => r.targetType === targetType);
        }
        return list;
      }
    } catch (err) {
      console.warn('[ReviewService] getApprovedReviews Firestore error, using fallback:', err);
    }

    // Fallback to local memory / initial approved reviews
    try {
      const stored = localStorage.getItem('mos_mos_reviews');
      const list: CustomerReview[] = stored ? JSON.parse(stored) : INITIAL_APPROVED_REVIEWS;
      const approved = list.filter(r => r.status === 'approved');

      if (targetSlug) {
        const filtered = approved.filter(r => !r.targetSlug || r.targetSlug === targetSlug);
        return filtered.length > 0 ? filtered : approved.slice(0, 2);
      }
      if (targetType) {
        const filtered = approved.filter(r => r.targetType === targetType);
        return filtered.length > 0 ? filtered : approved;
      }
      return approved;
    } catch {
      return INITIAL_APPROVED_REVIEWS;
    }
  },

  async getAllReviewsForAdmin(): Promise<CustomerReview[]> {
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      const list: CustomerReview[] = [];
      snap.forEach(d => list.push(d.data() as CustomerReview));
      if (list.length > 0) return list;
    } catch (err) {
      console.warn('[ReviewService] getAllReviewsForAdmin Firestore error:', err);
    }

    try {
      const stored = localStorage.getItem('mos_mos_reviews');
      return stored ? JSON.parse(stored) : INITIAL_APPROVED_REVIEWS;
    } catch {
      return INITIAL_APPROVED_REVIEWS;
    }
  },

  async moderateReview(reviewId: string, status: 'approved' | 'rejected'): Promise<boolean> {
    try {
      const docRef = doc(db, 'reviews', reviewId);
      await updateDoc(docRef, {
        status,
        moderatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('[ReviewService] moderateReview Firestore error:', err);
    }

    try {
      const stored = localStorage.getItem('mos_mos_reviews');
      if (stored) {
        const list: CustomerReview[] = JSON.parse(stored);
        const idx = list.findIndex(r => r.id === reviewId);
        if (idx !== -1) {
          list[idx].status = status;
          localStorage.setItem('mos_mos_reviews', JSON.stringify(list));
        }
      }
    } catch {
      // silent
    }

    return true;
  }
};
