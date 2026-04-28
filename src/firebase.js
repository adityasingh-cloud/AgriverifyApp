import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, query, where, updateDoc, increment, addDoc, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_MOCK_API_KEY_PLEASE_REPLACE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agriverify-d9dbb.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agriverify-d9dbb",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agriverify-d9dbb.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "797297057956",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:797297057956:web:mock12345"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Helper reference functions for easy access in Context
export const usersRef = collection(db, "users");
export const postsRef = collection(db, "posts");
export const commentsRef = collection(db, "comments");
export const followersRef = collection(db, "followers");

export { doc, setDoc, getDoc, getDocs, onSnapshot, query, where, updateDoc, increment, addDoc, orderBy, ref, uploadString, getDownloadURL };
