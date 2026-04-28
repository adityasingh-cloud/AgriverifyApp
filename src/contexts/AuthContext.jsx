import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { db, usersRef, postsRef, followersRef, commentsRef, doc, setDoc, getDoc, onSnapshot, query, where, addDoc, orderBy, deleteDoc, updateDoc, increment } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { user: auth0User, isAuthenticated, isLoading: auth0Loading, loginWithRedirect, logout: auth0Logout, getAccessTokenSilently } = useAuth0();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [following, setFollowing] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [socialGraph, setSocialGraph] = useState({});
  const [scans, setScans] = useState([]);
  
  const [onboardingSuccess, setOnboardingSuccess] = useState(false);

  useEffect(() => {
    if (auth0Loading) return;

    const syncUser = async () => {
      setLoading(true);
      if (isAuthenticated && auth0User) {
        // Sync with Firestore using Auth0 sub as ID (user.sub)
        const userDoc = await getDoc(doc(usersRef, auth0User.sub));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({ ...userData, isNew: false });
          setupRealtimeListeners(auth0User.sub);
        } else {
          // User authenticated in Auth0 but profile missing in Firestore
          setUser({ uid: auth0User.sub, email: auth0User.email, isNew: true });
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    syncUser();
    
    const savedScans = localStorage.getItem('agriverify_scans');
    if (savedScans) setScans(JSON.parse(savedScans));

  }, [isAuthenticated, auth0User, auth0Loading]);

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
      console.warn("Realtime listeners failed:", e);
      setLoading(false);
    }
  };

  const login = async () => {
    await loginWithRedirect();
  };

  const logout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    setUser(null);
    setPosts([]);
    setFollowing([]);
  };

  const completeProfile = async (formData) => {
    if (!auth0User?.sub) {
      console.error("No Auth0 sub found during profile completion.");
      return;
    }
    setLoading(true);

    try {
      console.log("Saving profile to Firestore for UID:", auth0User.sub);
      const finalUser = {
        ...formData,
        uid: auth0User.sub,
        email: auth0User.email || '',
        avatar: formData.avatar || auth0User.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1e293b&color=fff`,
        nameLowerCase: formData.name.toLowerCase(),
        isPrivate: false,
        followersCount: 0,
        followingCount: 0,
        isNew: false
      };
      
      await setDoc(doc(usersRef, auth0User.sub), finalUser);
      console.log("Profile saved successfully.");
      
      setOnboardingSuccess(true);
      
      // Force app state update
      setUser(finalUser);
      setupRealtimeListeners(auth0User.sub);
      
      // If the app doesn't redirect in 2 seconds, force a reload to be safe
      setTimeout(() => {
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error("CRITICAL: Onboarding failed:", error);
      alert("Failed to sync compliance profile. Error: " + error.message);
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

  const togglePrivacy = async () => {
    await updateProfile({ isPrivate: !user.isPrivate });
  };

  const searchUsers = (searchQuery) => {
    if (!searchQuery.trim()) {
      setSocialGraph({});
      return;
    }
    const searchLower = searchQuery.toLowerCase();
    const q = query(usersRef, where('nameLowerCase', '>=', searchLower), where('nameLowerCase', '<=', searchLower + '\uf8ff'));
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
    const followId = `${user.uid}_${targetId}`;
    const isFollowing = following.includes(targetId);
    
    if (isFollowing) {
      await deleteDoc(doc(followersRef, followId));
      await updateDoc(doc(usersRef, user.uid), { followingCount: increment(-1) });
      await updateDoc(doc(usersRef, targetId), { followersCount: increment(-1) });
    } else {
      await setDoc(doc(followersRef, followId), {
        followerId: user.uid,
        targetId: targetId,
        createdAt: Date.now()
      });
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
      location: user.city ? `${user.city}, ${user.state}` : "India",
      likes: 0,
      createdAt: Date.now()
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
      createdAt: Date.now()
    });
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

  const getAuthToken = async () => {
    try {
      return await getAccessTokenSilently();
    } catch (e) {
      console.error("Token fetch failed", e);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, completeProfile, logout, updateProfile, scans, addScan, 
      posts, addPost, loading: loading || auth0Loading,
      togglePrivacy, following, toggleFollow, socialGraph, searchUsers, followersCount,
      comments, addComment, fetchComments, getAuthToken, onboardingSuccess
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
