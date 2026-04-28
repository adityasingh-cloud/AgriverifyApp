import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, query, where, updateDoc, increment, addDoc, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_MOCK_API_KEY_PLEASE_REPLACE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agriverify-mock.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agriverify-mock",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agriverify-mock.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper reference functions for easy access in Context
export const usersRef = collection(db, "users");
export const postsRef = collection(db, "posts");
export const commentsRef = collection(db, "comments");
export const followersRef = collection(db, "followers");

export { doc, setDoc, getDoc, getDocs, onSnapshot, query, where, updateDoc, increment, addDoc, orderBy };
