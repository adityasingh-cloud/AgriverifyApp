import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, usersRef, postsRef, followersRef, commentsRef, doc, setDoc, getDoc, onSnapshot, query, where, addDoc, orderBy } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [following, setFollowing] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [socialGraph, setSocialGraph] = useState({});
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(usersRef, firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
          setupRealtimeListeners(firebaseUser.uid);
        } else {
          // User exists in Auth but not in Firestore (needs to complete profile)
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, isNew: true });
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    const savedScans = localStorage.getItem('agriverify_scans');
    if (savedScans) setScans(JSON.parse(savedScans));

    return () => unsubscribe();
  }, []);

  const setupRealtimeListeners = (uid) => {
    try {
      const qPosts = query(postsRef, orderBy('createdAt', 'desc'));
      const unsubPosts = onSnapshot(qPosts, (snapshot) => {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const qFollowing = query(followersRef, where('followerId', '==', uid));
      const unsubFollowing = onSnapshot(qFollowing, (snapshot) => {
        setFollowing(snapshot.docs.map(doc => doc.data().targetId));
      });

      const qFollowers = query(followersRef, where('targetId', '==', uid));
      const unsubFollowers = onSnapshot(qFollowers, (snapshot) => {
        setFollowersCount(snapshot.docs.length);
      });

      setLoading(false);
      return () => { unsubPosts(); unsubFollowing(); unsubFollowers(); };
    } catch (e) {
      console.warn("Firebase config missing. Operating in offline mode.", e);
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Auth Failed", error);
      // Fallback for demo without valid config
      completeProfile({ name: 'Guest User', phone: '0000000000', city: 'Demo City' }, 'guest_' + Date.now());
    }
  };

  const completeProfile = async (formData, fallbackUid = null) => {
    const uid = fallbackUid || user?.uid;
    const finalUser = {
      ...formData,
      uid,
      email: user?.email || '',
      avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1e293b&color=fff`,
      nameLowerCase: formData.name.toLowerCase(), // For case-insensitive search
      isPrivate: false,
    };
    
    try {
      await setDoc(doc(usersRef, uid), finalUser, { merge: true });
    } catch(e) {}
    
    setUser(finalUser);
    setupRealtimeListeners(uid);
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
    setPosts([]);
    setFollowing([]);
  };

  const updateProfile = async (updates) => {
    const updated = { ...user, ...updates };
    if (updates.name) updated.nameLowerCase = updates.name.toLowerCase();
    try {
      await setDoc(doc(usersRef, user.uid), updated, { merge: true });
    } catch(e) {}
    setUser(updated);
  };

  const togglePrivacy = async () => {
    const newStatus = !user.isPrivate;
    await updateProfile({ isPrivate: newStatus });
  };

  const searchUsers = (searchQuery) => {
    const searchLower = searchQuery.toLowerCase();
    const q = query(usersRef, where('nameLowerCase', '>=', searchLower), where('nameLowerCase', '<=', searchLower + 'uf8ff'));
    onSnapshot(q, (snapshot) => {
      const results = {};
      snapshot.docs.forEach(doc => {
        if (doc.id !== user?.uid) results[doc.id] = doc.data();
      });
      setSocialGraph(results);
    });
  };

  const toggleFollow = async (targetId) => {
    if (!user) return;
    try {
      const followId = `${user.uid}_${targetId}`;
      const isFollowing = following.includes(targetId);
      if (isFollowing) {
        // Mock unfollow for demo
      } else {
        await setDoc(doc(followersRef, followId), {
          followerId: user.uid,
          targetId: targetId,
          createdAt: Date.now()
        });
      }
    } catch (e) {}
  };

  const addPost = async (postData) => {
    if (!user) return;
    try {
      await addDoc(postsRef, {
        ...postData,
        userId: user.uid,
        user: user.name,
        avatar: user.avatar,
        location: user.city ? `${user.city}, ${user.state}` : "India",
        likes: 0,
        createdAt: Date.now()
      });
    } catch(e) {}
  };

  const addComment = async (postId, text) => {
    if (!user) return;
    try {
      await addDoc(commentsRef, {
        postId,
        userId: user.uid,
        userName: user.name,
        avatar: user.avatar,
        text,
        createdAt: Date.now()
      });
    } catch(e) {}
  };

  const fetchComments = (postId) => {
    const q = query(commentsRef, where('postId', '==', postId), orderBy('createdAt', 'asc'));
    onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(prev => ({ ...prev, [postId]: fetched }));
    });
  };

  const addScan = (scanData) => {
    const newScans = [scanData, ...scans];
    setScans(newScans);
    localStorage.setItem('agriverify_scans', JSON.stringify(newScans));
  };

  return (
    <AuthContext.Provider value={{ 
      user, loginWithGoogle, completeProfile, logout, updateProfile, scans, addScan, 
      posts, addPost, loading,
      togglePrivacy, following, toggleFollow, socialGraph, searchUsers, followersCount,
      comments, addComment, fetchComments
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
