import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { TravelPackage, Destination, GalleryMediaItem, ContentPublicationStatus } from '../types';
import { TRAVEL_PACKAGES } from '../data/packagesData';
import { DESTINATIONS } from '../data/destinationsData';
import React, { useState, useEffect } from 'react';

const PACKAGES_CACHE_KEY = 'mos_cms_packages_v2';
const DESTINATIONS_CACHE_KEY = 'mos_cms_destinations_v2';
const GALLERY_CACHE_KEY = 'mos_cms_gallery_v2';

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach(cb => {
    try {
      cb();
    } catch (err) {
      console.warn('[CmsService] Listener error:', err);
    }
  });
}

/**
 * Compresses an image file client-side into an optimized data URL
 * Used as fallback or high-performance zero-cost storage
 */
async function compressImageToDataUrl(file: File, maxWidth = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Try WebP first, fallback to JPEG
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          resolve(webpData);
        } catch {
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export const CmsService = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // ============================================================================
  // 1. TRAVEL PACKAGES CMS
  // ============================================================================

  /**
   * Returns list of packages from Firestore or cache, seeding defaults if empty
   */
  async getPackages(includeUnpublished = false): Promise<TravelPackage[]> {
    // 1. Try reading from Firestore
    try {
      const colRef = collection(db, 'cms_packages');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const remoteList: TravelPackage[] = [];
        snap.forEach(d => {
          remoteList.push(d.data() as TravelPackage);
        });

        // Cache locally
        localStorage.setItem(PACKAGES_CACHE_KEY, JSON.stringify(remoteList));

        if (!includeUnpublished) {
          return remoteList.filter(p => !p.status || p.status === 'Published');
        }
        return remoteList;
      }
    } catch (err) {
      console.warn('[CmsService] Firestore packages read fallback:', err);
    }

    // 2. Read from localStorage cache
    try {
      const cached = localStorage.getItem(PACKAGES_CACHE_KEY);
      if (cached) {
        const list: TravelPackage[] = JSON.parse(cached);
        if (list.length > 0) {
          if (!includeUnpublished) {
            return list.filter(p => !p.status || p.status === 'Published');
          }
          return list;
        }
      }
    } catch {}

    // 3. Fallback to hardcoded initial packages and auto-seed
    const initialList: TravelPackage[] = TRAVEL_PACKAGES.map(pkg => ({
      ...pkg,
      status: 'Published' as ContentPublicationStatus,
      currency: 'USD',
      priceType: 'per guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    localStorage.setItem(PACKAGES_CACHE_KEY, JSON.stringify(initialList));
    // Asynchronously seed Firestore in the background
    this.seedPackages(initialList).catch(() => {});

    if (!includeUnpublished) {
      return initialList.filter(p => p.status === 'Published');
    }
    return initialList;
  },

  /**
   * Find package by slug or ID
   */
  async getPackageBySlug(slug: string, includeUnpublished = false): Promise<TravelPackage | null> {
    const packages = await this.getPackages(includeUnpublished);
    return packages.find(p => p.slug === slug || p.id === slug) || null;
  },

  /**
   * Save or update travel package (creates if new, merges if existing)
   */
  async savePackage(pkg: TravelPackage): Promise<TravelPackage> {
    const id = pkg.id || pkg.slug || `pkg-${Date.now()}`;
    const slug = pkg.slug || id;
    const now = new Date().toISOString();

    const fullPackage: TravelPackage = {
      ...pkg,
      id,
      slug,
      status: pkg.status || 'Published',
      currency: pkg.currency || 'USD',
      priceType: pkg.priceType || 'per guest',
      createdAt: pkg.createdAt || now,
      updatedAt: now
    };

    // Update local cache
    try {
      const current = await this.getPackages(true);
      const index = current.findIndex(p => p.id === id || p.slug === slug);
      if (index >= 0) {
        current[index] = fullPackage;
      } else {
        current.unshift(fullPackage);
      }
      localStorage.setItem(PACKAGES_CACHE_KEY, JSON.stringify(current));
    } catch {}

    // Write to Firestore
    try {
      const docRef = doc(db, 'cms_packages', id);
      await setDoc(docRef, {
        ...fullPackage,
        serverUpdatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[CmsService] Could not persist package to Firestore:', err);
    }

    notifyListeners();
    return fullPackage;
  },

  /**
   * Direct, rapid price modification
   */
  async updatePackagePrice(
    id: string, 
    indicativePrice: number, 
    currency = 'USD', 
    priceType = 'per guest', 
    priceNote?: string
  ): Promise<boolean> {
    const current = await this.getPackages(true);
    const target = current.find(p => p.id === id || p.slug === id);
    if (!target) return false;

    target.indicativePrice = indicativePrice;
    target.currency = currency;
    target.priceType = priceType;
    if (priceNote !== undefined) target.priceNote = priceNote;
    target.updatedAt = new Date().toISOString();

    // Update cache
    localStorage.setItem(PACKAGES_CACHE_KEY, JSON.stringify(current));

    // Update Firestore
    try {
      const docRef = doc(db, 'cms_packages', target.id);
      await updateDoc(docRef, {
        indicativePrice,
        currency,
        priceType,
        priceNote: target.priceNote,
        updatedAt: target.updatedAt,
        serverUpdatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('[CmsService] Price update Firestore sync:', err);
    }

    notifyListeners();
    return true;
  },

  /**
   * Delete travel package
   */
  async deletePackage(id: string): Promise<boolean> {
    // Remove from local cache
    try {
      const current = await this.getPackages(true);
      const filtered = current.filter(p => p.id !== id && p.slug !== id);
      localStorage.setItem(PACKAGES_CACHE_KEY, JSON.stringify(filtered));
    } catch {}

    // Delete from Firestore
    try {
      const docRef = doc(db, 'cms_packages', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[CmsService] Firestore delete package:', err);
    }

    notifyListeners();
    return true;
  },

  // ============================================================================
  // 2. DESTINATION CMS
  // ============================================================================

  /**
   * Returns list of destinations from Firestore or cache, seeding defaults if empty
   */
  async getDestinations(includeUnpublished = false): Promise<Destination[]> {
    // 1. Try reading from Firestore
    try {
      const colRef = collection(db, 'cms_destinations');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const remoteList: Destination[] = [];
        snap.forEach(d => {
          remoteList.push(d.data() as Destination);
        });

        localStorage.setItem(DESTINATIONS_CACHE_KEY, JSON.stringify(remoteList));

        if (!includeUnpublished) {
          return remoteList.filter(d => !d.status || d.status === 'Published');
        }
        return remoteList;
      }
    } catch (err) {
      console.warn('[CmsService] Firestore destinations read fallback:', err);
    }

    // 2. Read from localStorage cache
    try {
      const cached = localStorage.getItem(DESTINATIONS_CACHE_KEY);
      if (cached) {
        const list: Destination[] = JSON.parse(cached);
        if (list.length > 0) {
          if (!includeUnpublished) {
            return list.filter(d => !d.status || d.status === 'Published');
          }
          return list;
        }
      }
    } catch {}

    // 3. Fallback to hardcoded initial destinations and auto-seed
    const initialList: Destination[] = DESTINATIONS.map(dest => ({
      ...dest,
      status: 'Published' as ContentPublicationStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    localStorage.setItem(DESTINATIONS_CACHE_KEY, JSON.stringify(initialList));
    this.seedDestinations(initialList).catch(() => {});

    if (!includeUnpublished) {
      return initialList.filter(d => d.status === 'Published');
    }
    return initialList;
  },

  /**
   * Find destination by slug or ID
   */
  async getDestinationBySlug(slug: string, includeUnpublished = false): Promise<Destination | null> {
    const list = await this.getDestinations(includeUnpublished);
    return list.find(d => d.slug === slug || d.id === slug) || null;
  },

  /**
   * Save or update destination
   */
  async saveDestination(dest: Destination): Promise<Destination> {
    const id = dest.id || dest.slug || `dest-${Date.now()}`;
    const slug = dest.slug || id;
    const now = new Date().toISOString();

    const fullDestination: Destination = {
      ...dest,
      id,
      slug,
      status: dest.status || 'Published',
      createdAt: dest.createdAt || now,
      updatedAt: now
    };

    // Update local cache
    try {
      const current = await this.getDestinations(true);
      const index = current.findIndex(d => d.id === id || d.slug === slug);
      if (index >= 0) {
        current[index] = fullDestination;
      } else {
        current.unshift(fullDestination);
      }
      localStorage.setItem(DESTINATIONS_CACHE_KEY, JSON.stringify(current));
    } catch {}

    // Write to Firestore
    try {
      const docRef = doc(db, 'cms_destinations', id);
      await setDoc(docRef, {
        ...fullDestination,
        serverUpdatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[CmsService] Could not persist destination to Firestore:', err);
    }

    notifyListeners();
    return fullDestination;
  },

  /**
   * Delete destination
   */
  async deleteDestination(id: string): Promise<boolean> {
    try {
      const current = await this.getDestinations(true);
      const filtered = current.filter(d => d.id !== id && d.slug !== id);
      localStorage.setItem(DESTINATIONS_CACHE_KEY, JSON.stringify(filtered));
    } catch {}

    try {
      const docRef = doc(db, 'cms_destinations', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[CmsService] Firestore delete destination:', err);
    }

    notifyListeners();
    return true;
  },

  // ============================================================================
  // 3. MEDIA & GALLERY MANAGEMENT
  // ============================================================================

  /**
   * Upload image file with automatic compression and multi-tier fallback
   */
  async uploadImage(file: File, folder = 'general'): Promise<string> {
    // Validate file size and type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files (JPEG, PNG, WebP, GIF) are accepted.');
    }

    // Tier 1: Try Firebase Cloud Storage if online
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `cms/${folder}/${Date.now()}_${safeName}`;
      const storageReference = ref(storage, storagePath);

      const snapshot = await uploadBytes(storageReference, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (storageErr) {
      console.warn('[CmsService] Cloud storage direct upload failed, using high-efficiency WebP encoder:', storageErr);
    }

    // Tier 2: Compress client-side to clean data URL (guaranteed 100% offline & Spark safe)
    return await compressImageToDataUrl(file);
  },

  /**
   * Fetch gallery items
   */
  async getGalleryItems(targetType?: string, targetId?: string): Promise<GalleryMediaItem[]> {
    try {
      const colRef = collection(db, 'cms_gallery');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items: GalleryMediaItem[] = [];
        snap.forEach(d => items.push(d.data() as GalleryMediaItem));
        localStorage.setItem(GALLERY_CACHE_KEY, JSON.stringify(items));
        return this.filterGalleryItems(items, targetType, targetId);
      }
    } catch {}

    try {
      const cached = localStorage.getItem(GALLERY_CACHE_KEY);
      if (cached) {
        const items: GalleryMediaItem[] = JSON.parse(cached);
        return this.filterGalleryItems(items, targetType, targetId);
      }
    } catch {}

    return [];
  },

  filterGalleryItems(items: GalleryMediaItem[], targetType?: string, targetId?: string): GalleryMediaItem[] {
    return items.filter(item => {
      if (targetType && item.targetType !== targetType) return false;
      if (targetId && item.targetId !== targetId) return false;
      return true;
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  /**
   * Save gallery item
   */
  async saveGalleryItem(item: GalleryMediaItem): Promise<GalleryMediaItem> {
    const id = item.id || `gal-${Date.now()}`;
    const fullItem = { ...item, id, createdAt: item.createdAt || new Date().toISOString() };

    try {
      const current = await this.getGalleryItems();
      const index = current.findIndex(g => g.id === id);
      if (index >= 0) current[index] = fullItem;
      else current.unshift(fullItem);
      localStorage.setItem(GALLERY_CACHE_KEY, JSON.stringify(current));
    } catch {}

    try {
      const docRef = doc(db, 'cms_gallery', id);
      await setDoc(docRef, fullItem, { merge: true });
    } catch (err) {
      console.warn('[CmsService] Gallery write to Firestore:', err);
    }

    notifyListeners();
    return fullItem;
  },

  /**
   * Delete gallery item
   */
  async deleteGalleryItem(id: string): Promise<boolean> {
    try {
      const current = await this.getGalleryItems();
      const filtered = current.filter(g => g.id !== id);
      localStorage.setItem(GALLERY_CACHE_KEY, JSON.stringify(filtered));
    } catch {}

    try {
      const docRef = doc(db, 'cms_gallery', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[CmsService] Gallery delete Firestore:', err);
    }

    notifyListeners();
    return true;
  },

  // ============================================================================
  // 4. DATABASE SEEDING
  // ============================================================================
  async seedPackages(packages: TravelPackage[]): Promise<void> {
    for (const pkg of packages) {
      try {
        const docRef = doc(db, 'cms_packages', pkg.id || pkg.slug);
        await setDoc(docRef, pkg, { merge: true });
      } catch {}
    }
  },

  async seedDestinations(destinations: Destination[]): Promise<void> {
    for (const dest of destinations) {
      try {
        const docRef = doc(db, 'cms_destinations', dest.id || dest.slug);
        await setDoc(docRef, dest, { merge: true });
      } catch {}
    }
  },

  async seedAll(force = false): Promise<{ packagesCount: number; destinationsCount: number }> {
    const pkgs = await this.getPackages(true);
    const dests = await this.getDestinations(true);
    await this.seedPackages(pkgs);
    await this.seedDestinations(dests);
    return {
      packagesCount: pkgs.length,
      destinationsCount: dests.length
    };
  }
};

/**
 * React hook for live travel packages with automatic re-renders on CMS edits
 */
export function useCmsPackages(includeUnpublished = false): {
  packages: TravelPackage[];
  loading: boolean;
  reload: () => Promise<void>;
} {
  const [packages, setPackages] = useState<TravelPackage[]>(() => {
    try {
      const cached = localStorage.getItem(PACKAGES_CACHE_KEY);
      if (cached) {
        const parsed: TravelPackage[] = JSON.parse(cached);
        return includeUnpublished ? parsed : parsed.filter(p => !p.status || p.status === 'Published');
      }
    } catch {}
    return includeUnpublished ? TRAVEL_PACKAGES : TRAVEL_PACKAGES.filter(p => !p.status || p.status === 'Published');
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPackages = React.useCallback(async () => {
    try {
      const list = await CmsService.getPackages(includeUnpublished);
      setPackages(list);
    } finally {
      setLoading(false);
    }
  }, [includeUnpublished]);

  useEffect(() => {
    fetchPackages();
    const unsubscribe = CmsService.subscribe(() => {
      fetchPackages();
    });
    return unsubscribe;
  }, [fetchPackages]);

  return { packages, loading, reload: fetchPackages };
}

/**
 * React hook for live destinations with automatic re-renders on CMS edits
 */
export function useCmsDestinations(includeUnpublished = false): {
  destinations: Destination[];
  loading: boolean;
  reload: () => Promise<void>;
} {
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    try {
      const cached = localStorage.getItem(DESTINATIONS_CACHE_KEY);
      if (cached) {
        const parsed: Destination[] = JSON.parse(cached);
        return includeUnpublished ? parsed : parsed.filter(d => !d.status || d.status === 'Published');
      }
    } catch {}
    return includeUnpublished ? DESTINATIONS : DESTINATIONS.filter(d => !d.status || d.status === 'Published');
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDestinations = React.useCallback(async () => {
    try {
      const list = await CmsService.getDestinations(includeUnpublished);
      setDestinations(list);
    } finally {
      setLoading(false);
    }
  }, [includeUnpublished]);

  useEffect(() => {
    fetchDestinations();
    const unsubscribe = CmsService.subscribe(() => {
      fetchDestinations();
    });
    return unsubscribe;
  }, [fetchDestinations]);

  return { destinations, loading, reload: fetchDestinations };
}
