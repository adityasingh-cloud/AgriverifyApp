// DEMO RECOVERY MODE: ALL FIREBASE SERVICES DISABLED
// This file provides empty exports to satisfy imports without crashing.

export const db = null;
export const auth = null;
export const googleProvider = null;

export const usersRef = null;
export const postsRef = null;
export const commentsRef = null;
export const followersRef = null;

export const doc = () => null;
export const setDoc = async () => {};
export const getDoc = async () => ({ exists: () => false, data: () => ({}) });
export const getDocs = async () => ({ docs: [] });
export const onSnapshot = () => () => {};
export const query = () => null;
export const where = () => null;
export const updateDoc = async () => {};
export const increment = () => 0;
export const addDoc = async () => ({ id: 'mock-id' });
export const orderBy = () => null;
export const deleteDoc = async () => {};

export const signInWithPopup = async () => {};
export const signInWithRedirect = async () => {};
export const signInAnonymously = async () => {};
export const signOut = async () => {};
export const onAuthStateChanged = () => () => {};
