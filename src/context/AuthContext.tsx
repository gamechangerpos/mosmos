import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { FirestoreService, CustomerProfile } from '../services/firestoreService';

interface AuthContextType {
  user: User | null;
  customerProfile: CustomerProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfileAndRoles = async (firebaseUser: User) => {
    try {
      // 1. Sync or retrieve customer profile
      await FirestoreService.createOrUpdateCustomer({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        phoneNumber: firebaseUser.phoneNumber || undefined
      });

      const profile = await FirestoreService.getCustomer(firebaseUser.uid);
      setCustomerProfile(profile);

      // 2. Check admin status in Firestore
      const adminStatus = await FirestoreService.checkIsAdmin(firebaseUser.uid, firebaseUser.email || undefined);
      setIsAdmin(adminStatus);
    } catch (err) {
      console.warn('[AuthContext] Error loading user profile:', err);
    }
  };

  useEffect(() => {
    // Check for redirect result on return from Google OAuth
    getRedirectResult(auth)
      .then(async (cred) => {
        if (cred && cred.user) {
          await fetchProfileAndRoles(cred.user);
        }
      })
      .catch((err) => {
        console.warn('[AuthContext] Redirect result check:', err);
      });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfileAndRoles(firebaseUser);
      } else {
        setCustomerProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    await fetchProfileAndRoles(cred.user);
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (name.trim()) {
      await updateProfile(cred.user, { displayName: name.trim() });
    }
    await fetchProfileAndRoles(cred.user);
  };

  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await fetchProfileAndRoles(cred.user);
    } catch (popupErr: any) {
      // If popup is blocked by browser or fails on mobile with storage partition restriction, fall back to redirect
      if (
        popupErr.code === 'auth/popup-blocked' || 
        popupErr.code === 'auth/cancelled-popup-request'
      ) {
        console.warn('[AuthContext] Popup blocked, initiating redirect sign-in...');
        await signInWithRedirect(auth, googleProvider);
      } else {
        throw popupErr;
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setCustomerProfile(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfileAndRoles(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customerProfile,
        isAdmin,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
