import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Firebase configuration using Vite environment variables with fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBQ9efD6Kq7LFa9mZGs9MzowmHaQrI5CrU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mosmos-61ca4.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://mosmos-61ca4-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mosmos-61ca4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mosmos-61ca4.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1032698588498",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1032698588498:web:4e30dc921e5638b77fde8b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NL7KLC9MB0"
};

// Singleton initialization to prevent multiple instances
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Authentication service with explicit browser local persistence
export const auth: Auth = getAuth(app);
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('[Firebase] Auth persistence initialization:', err);
  });
}

// Google OAuth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Cloud Firestore database service
export const db: Firestore = getFirestore(app);

// Firebase Storage service (for media uploads when available)
export const storage: FirebaseStorage = getStorage(app);

// Optional Analytics instance (browser only)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics optional fallback
  });
}
