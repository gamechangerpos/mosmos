import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GalleryStory } from '../types';

export const INITIAL_GALLERY_STORIES: GalleryStory[] = [
  {
    id: 'story_1',
    slug: 'silverback-dawn-bwindi',
    title: 'The Patriarch of Bwindi Mist',
    caption: 'A 200kg habituated silverback observes his troop waking in the dense canopy of Bwindi.',
    story: 'At 6:30 AM in the Bwindi Impenetrable Forest, morning fog curls through the ancient tree ferns. Accompanied by experienced UWA rangers, we tracked the Mubare family for two hours up steep moss-covered ridges. When the silverback emerged through the bamboo leaves, time suspended. His steady amber gaze carried ancient wisdom and quiet majesty.',
    coverImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85'
    ],
    destination: 'Bwindi Impenetrable National Park',
    country: 'Uganda',
    category: 'Gorilla Trekking',
    year: 2025,
    photographer: 'David K. Ssenyonga',
    relatedPackageSlug: 'uganda-gorilla-wildlife-safari',
    featured: true,
    createdAt: '2025-09-12T08:00:00Z'
  },
  {
    id: 'story_2',
    slug: 'mara-river-crossing-frenzy',
    title: 'Thunder Across the Mara River',
    caption: 'Over two hundred thousand blue wildebeest plunge through the crocodile-filled Mara waters.',
    story: 'The Great Migration reaches its crescendo between July and October. For three days, tens of thousands of wildebeest gathered along the northern bluffs of the Mara River. When the lead animal finally took the plunge, a torrential cascade followed. Our customized photographic land cruiser gave travelers front-row, ethical vantage points.',
    coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=85'
    ],
    destination: 'Maasai Mara National Reserve',
    country: 'Kenya',
    category: 'Wildlife',
    year: 2025,
    photographer: 'Claire Montgomery',
    relatedPackageSlug: 'kenya-classic-safari',
    featured: true,
    createdAt: '2025-08-19T14:30:00Z'
  },
  {
    id: 'story_3',
    slug: 'ngorongoro-crater-sunrise',
    title: 'Golden Hour on the Crater Floor',
    caption: 'A pride of black-maned lions resting beside the alkaline shallows of Lake Magadi.',
    story: 'Descending the 600-meter sheer caldera wall before dawn feels like entering a lost world. The Ngorongoro Crater shelters over 25,000 large mammals within an unbroken volcanic amphitheater. As the golden sunrise pierced the mist, we found two mature male lions grooming atop an ancient termite mound.',
    coverImage: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=85'
    ],
    destination: 'Ngorongoro Conservation Area',
    country: 'Tanzania',
    category: 'Safari',
    year: 2025,
    photographer: 'Amani Kimaro',
    relatedPackageSlug: 'tanzania-serengeti-safari',
    featured: true,
    createdAt: '2025-07-04T07:15:00Z'
  },
  {
    id: 'story_4',
    slug: 'volcanoes-mist-rwanda',
    title: 'Virunga Volcanoes Mist and Bamboo',
    caption: 'Golden monkeys leaping through the high bamboo forests beneath Mount Bisoke.',
    story: 'Rwanda is a testament to pristine ecological stewardship. Beyond mountain gorillas, the sub-alpine bamboo belts of Volcanoes National Park shelter endangered golden monkeys. Their playful curiosity and vivid fiery coats against emerald foliage make this one of the most vibrant primate encounters in Africa.',
    coverImage: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=85'
    ],
    destination: 'Volcanoes National Park',
    country: 'Rwanda',
    category: 'Gorilla Trekking',
    year: 2024,
    photographer: 'Jean-Paul Habimana',
    relatedPackageSlug: 'rwanda-gorilla-safari',
    featured: false,
    createdAt: '2024-11-20T11:00:00Z'
  },
  {
    id: 'story_5',
    slug: 'okavango-mokoro-channels',
    title: 'Silent Glides Through Okavango Waters',
    caption: 'Navigating papyrus water channels in a traditional dugout mokoro canoe.',
    story: 'The Okavango Delta is an oasis in the Kalahari. With our local poler navigating lily pads without any engine noise, we approached African fish eagles, waterbuck, and a herd of elephants bathing along the sandbanks. True luxury is absolute silence in wild nature.',
    coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=85'
    ],
    destination: 'Okavango Delta',
    country: 'Botswana',
    category: 'Luxury Lodges',
    year: 2024,
    photographer: 'Sarah Jenkins',
    relatedPackageSlug: 'botswana-okavango-delta',
    featured: false,
    createdAt: '2024-10-08T15:20:00Z'
  },
  {
    id: 'story_6',
    slug: 'zanzibar-dhow-sunset',
    title: 'Spice Coast Dhows at Sunset',
    caption: 'Handcrafted wooden dhows skimming the turquoise waters of Kendwa.',
    story: 'After days of dusty savanna game drives, the spice island of Zanzibar offers restorative bliss. Savoring fresh cardamom tea and Swahili seafood while drifting under billowing white canvas sails at dusk is the quintessential safari finale.',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85'
    ],
    destination: 'Zanzibar Archipelago',
    country: 'Zanzibar',
    category: 'Beach',
    year: 2026,
    photographer: 'Tariq Al-Mansoor',
    relatedPackageSlug: 'zanzibar-beach-retreat',
    featured: true,
    createdAt: '2026-01-14T17:40:00Z'
  }
];

export const GalleryService = {
  async getStories(): Promise<GalleryStory[]> {
    try {
      const q = query(collection(db, 'gallery_stories'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      const list: GalleryStory[] = [];
      snap.forEach(d => list.push(d.data() as GalleryStory));
      if (list.length > 0) {
        localStorage.setItem('mos_mos_gallery_stories', JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.warn('[GalleryService] getStories Firestore error:', err);
    }

    try {
      const stored = localStorage.getItem('mos_mos_gallery_stories');
      if (stored) return JSON.parse(stored);
    } catch {
      // silent
    }

    return INITIAL_GALLERY_STORIES;
  },

  async getStoryBySlug(slug: string): Promise<GalleryStory | null> {
    const stories = await this.getStories();
    return stories.find(s => s.slug === slug || s.id === slug) || null;
  },

  async saveStory(story: GalleryStory): Promise<GalleryStory> {
    const id = story.id || `story_${Date.now()}`;
    const fullStory: GalleryStory = {
      ...story,
      id,
      slug: story.slug || `story-${Date.now()}`,
      createdAt: story.createdAt || new Date().toISOString()
    };

    // Update local cache
    try {
      const stories = await this.getStories();
      const idx = stories.findIndex(s => s.id === id || s.slug === fullStory.slug);
      if (idx !== -1) {
        stories[idx] = fullStory;
      } else {
        stories.unshift(fullStory);
      }
      localStorage.setItem('mos_mos_gallery_stories', JSON.stringify(stories));
    } catch {
      // silent
    }

    // Write to Firestore
    try {
      const docRef = doc(db, 'gallery_stories', id);
      await setDoc(docRef, {
        ...fullStory,
        serverUpdatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[GalleryService] saveStory Firestore error:', err);
    }

    return fullStory;
  },

  async deleteStory(id: string): Promise<boolean> {
    try {
      const stories = await this.getStories();
      const filtered = stories.filter(s => s.id !== id);
      localStorage.setItem('mos_mos_gallery_stories', JSON.stringify(filtered));
    } catch {
      // silent
    }

    try {
      const docRef = doc(db, 'gallery_stories', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[GalleryService] deleteStory Firestore error:', err);
    }

    return true;
  }
};
