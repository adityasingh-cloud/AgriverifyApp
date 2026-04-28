import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signInAnonymously, signOut, onAuthStateChanged, usersRef, postsRef, followersRef, commentsRef, doc, setDoc, getDoc, onSnapshot, query, where, addDoc, orderBy, deleteDoc, updateDoc, increment } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [posts, setPosts]       = useState([]);
  const [comments, setComments] = useState({});
  const [following, setFollowing]       = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [socialGraph, setSocialGraph]   = useState({});
  const [scans, setScans]       = useState([]);

  /* ─── Auth listener ─────────────────────────────────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(usersRef, firebaseUser.uid));
          if (snap.exists()) {
            setUser({ ...snap.data(), isNew: false });
            setupListeners(firebaseUser.uid);
          } else {
            // Authenticated but no Firestore profile → onboarding
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, isNew: true });
          }
        } catch (err) {
          console.error('Firestore sync error:', err);
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, isNew: true });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const saved = localStorage.getItem('agriverify_scans');
    if (saved) setScans(JSON.parse(saved));

    return unsub;
  }, []);

  /* ─── Realtime listeners ─────────────────────────────── */
  const setupListeners = (uid) => {
    try {
      const unsubPosts = onSnapshot(
        query(postsRef, orderBy('createdAt', 'desc')),
        (snap) => setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      );
      const unsubFollowing = onSnapshot(
        query(followersRef, where('followerId', '==', uid)),
        (snap) => setFollowing(snap.docs.map(d => d.data().targetId))
      );
      const unsubFollowers = onSnapshot(
        query(followersRef, where('targetId', '==', uid)),
        (snap) => setFollowersCount(snap.docs.length)
      );
      return () => { unsubPosts(); unsubFollowing(); unsubFollowers(); };
    } catch (e) {
      console.warn('Listener setup failed:', e);
    }
  };

  /* ─── Auth actions ───────────────────────────────────── */
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged handles the rest
    } catch (err) {
      console.error('Google Sign-In error:', err);
      alert('Google Sign-In failed: ' + err.message);
    }
  };

  // Phone OTP is simulated — create an anonymous Firebase session so the
  // profile form has a real uid to save against in Firestore.
  const loginWithPhone = async () => {
    try {
      await signInAnonymously(auth);
      // onAuthStateChanged will fire → sets user = { uid, isNew: true }
    } catch (err) {
      console.error('Anonymous sign-in error:', err);
      alert('Could not start phone session: ' + err.message);
      throw err;
    }
  };

  const completeProfile = async (formData) => {
    // Use uid from React state — never rely on auth.currentUser which can
    // momentarily be null during Firebase token refresh cycles.
    const uid = user?.uid || auth.currentUser?.uid;
    if (!uid) {
      console.error("Session Check Failed. User State:", user, "Auth CurrentUser:", auth.currentUser);
      alert('Your session could not be found. Please try logging in again. (Reason: No UID)');
      return;
    }
    setLoading(true);
    try {
      const firebaseUser = auth.currentUser; // may be null; use uid from state as fallback
      const finalUser = {
        ...formData,
        uid,
        email: user?.email || firebaseUser?.email || '',
        avatar:
          formData.avatar ||
          firebaseUser?.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1e293b&color=fff`,
        nameLowerCase: formData.name.toLowerCase(),
        isPrivate: false,
        followersCount: 0,
        followingCount: 0,
        isNew: false,
      };
      await setDoc(doc(usersRef, uid), finalUser);
      setUser(finalUser);
      setupListeners(uid);
    } catch (err) {
      console.error('Profile save failed:', err);
      alert('Failed to save profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setPosts([]);
    setFollowing([]);
  };

  const updateProfile = async (updates) => {
    if (!user?.uid) return;
    const updated = { ...user, ...updates };
    if (updates.name) updated.nameLowerCase = updates.name.toLowerCase();
    await setDoc(doc(usersRef, user.uid), updated, { merge: true });
    setUser(updated);
  };

  const togglePrivacy = () => updateProfile({ isPrivate: !user.isPrivate });

  const searchUsers = (q) => {
    if (!q.trim()) { setSocialGraph({}); return; }
    const lower = q.toLowerCase();
    onSnapshot(
      query(usersRef, where('nameLowerCase', '>=', lower), where('nameLowerCase', '<=', lower + '\uf8ff')),
      (snap) => {
        const res = {};
        snap.docs.forEach(d => { if (d.id !== user?.uid) res[d.id] = d.data(); });
        setSocialGraph(res);
      }
    );
  };

  const toggleFollow = async (targetId) => {
    if (!user) return;
    const followId = `${user.uid}_${targetId}`;
    const isFollowing = following.includes(targetId);
    if (isFollowing) {
      await deleteDoc(doc(followersRef, followId));
      await updateDoc(doc(usersRef, user.uid), { followingCount: increment(-1) });
      await updateDoc(doc(usersRef, targetId), { followersCount: increment(-1) });
    } else {
      await setDoc(doc(followersRef, followId), { followerId: user.uid, targetId, createdAt: Date.now() });
      await updateDoc(doc(usersRef, user.uid), { followingCount: increment(1) });
      await updateDoc(doc(usersRef, targetId), { followersCount: increment(1) });
    }
  };

  const addPost = async (postData) => {
    if (!user) return;
    await addDoc(postsRef, {
      ...postData,
      userId: user.uid,
      user: user.name,
      avatar: user.avatar,
      isPrivate: user.isPrivate || false,
      location: user.city ? `${user.city}, ${user.state}` : 'India',
      likes: 0,
      createdAt: Date.now(),
    });
  };

  const addComment = async (postId, text) => {
    if (!user) return;
    await addDoc(commentsRef, {
      postId,
      userId: user.uid,
      userName: user.name,
      avatar: user.avatar,
      text,
      createdAt: Date.now(),
    });
  };

  const fetchComments = (postId) => {
    onSnapshot(
      query(commentsRef, where('postId', '==', postId), orderBy('createdAt', 'asc')),
      (snap) => {
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setComments(prev => ({ ...prev, [postId]: fetched }));
      }
    );
  };

  const addScan = (scanData) => {
    const updated = [scanData, ...scans];
    setScans(updated);
    localStorage.setItem('agriverify_scans', JSON.stringify(updated));
  };

  // Compatibility shim for CameraFlow
  const getAuthToken = async () => {
    try { return await auth.currentUser?.getIdToken(); }
    catch { return null; }
  };

  return (
    <AuthContext.Provider value={{
      user, loading,
      loginWithGoogle, loginWithPhone, completeProfile, logout, updateProfile,
      scans, addScan,
      posts, addPost,
      togglePrivacy, following, toggleFollow, socialGraph, searchUsers, followersCount,
      comments, addComment, fetchComments,
      getAuthToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
