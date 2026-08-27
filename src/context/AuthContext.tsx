import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut, signInAnonymously } from 'firebase/auth';
// @ts-ignore
import { auth, googleProvider } from '../firebase';
// @ts-ignore
import authAPI, { setSessionUser } from '../api/axios';

export interface User {
  _id: string;
  firebaseUid?: string;
  email: string;
  name: string;
  photo: string;
  role: 'admin' | 'expert' | 'patient';
  isActive: boolean;
  createdAt: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isExpert: boolean;
  isPatient: boolean;
  hasRole: (...roles: string[]) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<User>;
  getDashboardPath: () => string;
  isLoginPending: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPending, setIsLoginPending] = useState(false);

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
    setSessionUser(user);
  }, [user]);

  // Listen to Firebase Auth state for background persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken(true);
          const res = await authAPI.verifyFirebase(token);
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          // If local admin session exists, don't clear it on null Firebase auth
          if (userRef.current && userRef.current._id === 'admin-local') {
            return;
          }
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Background auth sync failed:", err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Universal Login supporting Firebase Auth & Safe Local Admin Fallbacks
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    if (isLoginPending) return false;
    setIsLoginPending(true);

    // Support email/password admin flow with robust fallback
    if (email && password) {
      try {
        // Attempt Firebase Email/Password Authentication
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = credential.user;
        const token = await firebaseUser.getIdToken(true);
        const res = await authAPI.verifyFirebase(token);
        
        setUser(res.data.user);
        setIsAuthenticated(true);
        setIsLoginPending(false);
        return true;
      } catch (err) {
        console.warn('Firebase Email/Password failed or not allowed. Checking local credentials...', err);
        
        // Robust Fallback: Verify admin credentials locally if Firebase Auth provider is disabled
        const isDefaultAdmin =
          (email.trim().toLowerCase() === 'admin' || email.trim().toLowerCase() === 'zkrehabsphere@gmail.com') &&
          (password === 'SajidPhysiocu-ver299');

        if (isDefaultAdmin) {
          try {
            await signInAnonymously(auth);
          } catch (anonErr) {
            console.warn('Anonymous auth sign-in failed during admin fallback:', anonErr);
          }
          const localAdminUser: User = {
            _id: 'admin-local',
            firebaseUid: auth.currentUser?.uid || 'admin-local-uid',
            email: 'zkrehabsphere@gmail.com',
            name: 'ZK Rehab Sphere Admin',
            photo: '',
            role: 'admin',
            isActive: true,
            createdAt: new Date().toISOString(),
          };
          setUser(localAdminUser);
          setIsAuthenticated(true);
          setIsLoginPending(false);
          return true;
        }
      }
      setIsLoginPending(false);
      return false;
    }

    // Google Sign-in Popup Flow
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = credential.user;
      if (!firebaseUser) {
        throw new Error('Firebase login did not return a user object.');
      }

      const token = await firebaseUser.getIdToken(true);
      const res = await authAPI.verifyFirebase(token);
      const loggedInUser = res.data.user;

      setUser(loggedInUser);
      setIsAuthenticated(true);
      setIsLoginPending(false);
      return true;
    } catch (err) {
      console.error('Google login failed:', err);
      setIsLoginPending(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth); // Sign out of Firebase
      await authAPI.logout(); // Clear backend cookie session if still used
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      window.location.hash = '#home';
    }
  };

  const updateProfile = async (data: any): Promise<User> => {
    const res = await authAPI.updateProfile(data);
    setUser(res.data.user);
    return res.data.user;
  };

  // Helpers
  const isAdmin = user?.role === 'admin';
  const isExpert = user?.role === 'expert';
  const isPatient = user?.role === 'patient';
  const hasRole = (...roles: string[]) => roles.includes(user?.role || '');

  const getDashboardPath = (): string => {
    if (!user) return '/login';
    const paths: Record<string, string> = { admin: '/dashboard/admin', doctor: '/dashboard/doctor', patient: '/dashboard/patient' };
    return paths[user.role] || '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        isExpert,
        isPatient,
        hasRole,
        login,
        logout,
        updateProfile,
        getDashboardPath,
        isLoginPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
