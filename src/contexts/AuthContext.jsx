import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { db, usersRef, postsRef, followersRef, commentsRef, doc, setDoc, getDoc, onSnapshot, query, where, addDoc, orderBy, deleteDoc, updateDoc, increment } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { 
    user: auth0User, 
    isAuthenticated, 
    isLoading: auth0Loading, 
    loginWithRedirect, 
    logout: auth0Logout 
  } = useAuth0();

  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [posts, setPosts]       = useState([]);
  const [comments, setComments] = useState({});
  const [following, setFollowing]       = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [socialGraph, setSocialGraph]   = useState({});
  const [scans, setScans]       = useState([]);

  // Sync Auth0 state with Firestore
  useEffect(() => {
    if (auth0Loading) return;

    if (!isAuthenticated) {
      setUser(null);
      setLoading(false);
      return;
    }

    const checkProfile = async () => {
      const uid = auth0User.sub;
      
      // 2-second watchdog for Firestore check
      const watchdog = setTimeout(() => {
        if (loading) {
          console.warn("Profile check took too long (>2s). Defaulting to onboarding.");
          setUser({ uid, email: auth0User.email, isNew: true });
          setLoading(false);
        }
      }, 2000);

      try {
        const snap = await getDoc(doc(usersRef, uid));
        clearTimeout(watchdog);
        if (snap.exists()) {
          setUser({ ...snap.data(), isNew: false });
          setupListeners(uid);
        } else {
          setUser({ uid, email: auth0User.email, isNew: true });
        }
      } catch (err) {
        console.error('Firestore sync error:', err);
        clearTimeout(watchdog);
        setUser({ uid, email: auth0User.email, isNew: true });
      }
      setLoading(false);
    };

    checkProfile();
  }, [isAuthenticated, auth0User, auth0Loading]);

  useEffect(() => {
    const saved = localStorage.getItem('agriverify_scans');
    if (saved) setScans(JSON.parse(saved));
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
  const login = () => loginWithRedirect();
  
  const logout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    setUser(null);
    setPosts([]);
    setFollowing([]);
  };

  const completeProfile = async (formData) => {
    const uid = auth0User?.sub;
    if (!uid) {
      alert('Your session could not be found. Please sign in again.');
      return;
    }
    setLoading(true);
    try {
      const finalUser = {
        ...formData,
        uid,
        email: auth0User.email || '',
        avatar: formData.avatar || auth0User.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1e293b&color=fff`,
        nameLowerCase: formData.name.toLowerCase(),
        isPrivate: false,
        followersCount: 0,
        followingCount: 0,
        isNew: false,
      };

      await setDoc(doc(usersRef, uid), finalUser);
      setUser(finalUser);
      setupListeners(uid);
      
      // CRITICAL: Immediate redirect as requested
      window.location.assign('/dashboard');
    } catch (err) {
      console.error('Profile save failed:', err);
      alert('Failed to save profile: ' + err.message);
    } finally {
      setLoading(false);
    }
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

  const getAuthToken = async () => null; // Not needed for Auth0 in this context

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, logout, completeProfile, updateProfile,
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
