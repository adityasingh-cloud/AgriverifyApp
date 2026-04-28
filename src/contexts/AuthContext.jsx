import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, usersRef, postsRef, followersRef, commentsRef, doc, setDoc, getDoc, onSnapshot, query, where, addDoc, orderBy } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Real-time Database States
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [following, setFollowing] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [socialGraph, setSocialGraph] = useState({}); // Stores searched users
  
  // Scans (Kept in LocalStorage for now to simulate local hardware camera ledger)
  const [scans, setScans] = useState([]);

  useEffect(() => {
    // 1. Initialize Local Session
    const savedUser = localStorage.getItem('agriverify_user');
    const savedScans = localStorage.getItem('agriverify_scans');
    if (savedScans) setScans(JSON.parse(savedScans));
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setupRealtimeListeners(parsedUser.uid);
    } else {
      setLoading(false);
    }
  }, []);

  const setupRealtimeListeners = (uid) => {
    try {
      // Listen to Posts
      const qPosts = query(postsRef, orderBy('createdAt', 'desc'));
      const unsubPosts = onSnapshot(qPosts, (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      });

      // Listen to Current User's Following List
      const qFollowing = query(followersRef, where('followerId', '==', uid));
      const unsubFollowing = onSnapshot(qFollowing, (snapshot) => {
        setFollowing(snapshot.docs.map(doc => doc.data().targetId));
      });

      // Listen to Current User's Followers Count
      const qFollowers = query(followersRef, where('targetId', '==', uid));
      const unsubFollowers = onSnapshot(qFollowers, (snapshot) => {
        setFollowersCount(snapshot.docs.length);
      });

      setLoading(false);
      return () => { unsubPosts(); unsubFollowing(); unsubFollowers(); };
    } catch (e) {
      console.warn("Firebase config missing or invalid. Operating in offline mode.", e);
      setLoading(false);
    }
  };

  const login = async (userData) => {
    const uid = userData.phone.replace(/D/g,'') || `user_${Date.now()}`; // Generate simple UID from phone
    const finalUser = {
      ...userData,
      uid,
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=1e293b&color=fff`,
      isPrivate: false,
    };
    
    try {
      // Sync user profile to Firestore
      await setDoc(doc(usersRef, uid), finalUser, { merge: true });
    } catch(e) {}
    
    setUser(finalUser);
    localStorage.setItem('agriverify_user', JSON.stringify(finalUser));
    setupRealtimeListeners(uid);
  };

  const logout = () => {
    setUser(null);
    setPosts([]);
    setFollowing([]);
    localStorage.removeItem('agriverify_user');
  };

  const updateProfile = async (updates) => {
    const updated = { ...user, ...updates };
    try {
      await setDoc(doc(usersRef, user.uid), updated, { merge: true });
    } catch(e) {}
    setUser(updated);
    localStorage.setItem('agriverify_user', JSON.stringify(updated));
  };

  const togglePrivacy = async () => {
    const newStatus = !user.isPrivate;
    await updateProfile({ isPrivate: newStatus });
  };

  // --- Real-time Search & Follow Logic ---
  const searchUsers = (searchQuery) => {
    // Basic prefix search implementation (Requires lowercase name field in production)
    const q = query(usersRef, where('name', '>=', searchQuery), where('name', '<=', searchQuery + 'uf8ff'));
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
        // Unfollow (We simulate delete by just not doing it natively to save DB rules for demo, but normally deleteDoc)
        // For simplicity in this demo, we will re-sync lists, normally: deleteDoc(doc(followersRef, followId))
      } else {
        // Follow
        await setDoc(doc(followersRef, followId), {
          followerId: user.uid,
          targetId: targetId,
          createdAt: Date.now()
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- Post & Comment Logic ---
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

  const toggleLike = (id) => {
    // In production: updateDoc(doc(postsRef, id), { likes: increment(1) })
  };

  const addScan = (scanData) => {
    const newScans = [scanData, ...scans];
    setScans(newScans);
    localStorage.setItem('agriverify_scans', JSON.stringify(newScans));
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, updateProfile, scans, addScan, 
      posts, addPost, toggleLike, loading,
      togglePrivacy, following, toggleFollow, socialGraph, searchUsers, followersCount,
      comments, addComment, fetchComments
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
