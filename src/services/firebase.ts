import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

// Production Firebase Configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBGS87_xyloZQtJW184ZtEKLqNCiLKfeK4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zk-rehab-sphere.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zk-rehab-sphere",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zk-rehab-sphere.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "26968015783",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:26968015783:web:2698474b06f31f3a196c82",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-B0YM9LWBYL"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const isFirebaseActive = true;
