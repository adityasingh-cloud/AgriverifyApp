import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const safeJSONParse = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.warn(`Error parsing ${key} from localStorage`, e);
    return fallback;
  }
};

export function AuthProvider({ children }) {
  // DEMO MODE: Static User Data
  const [user, setUser] = useState({
    uid: 'demo-user-123',
    name: 'Demo User',
    email: 'demo@agriverify.com',
    city: 'Kolkata',
    state: 'WB',
    avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=22c55e&color=fff',
    isNew: false,
    followersCount: 124,
    followingCount: 89,
    isPrivate: false,
    gender: 'Male'
  });

  const [loading] = useState(false);
  const [posts, setPosts] = useState([
    { id: '1', user: 'Farmer Aman', content: 'Great harvest this year! 🌾', location: 'Punjab', likes: 24, createdAt: Date.now() - 1000000, avatar: 'https://ui-avatars.com/api/?name=Aman&background=random' },
    { id: '2', user: 'AgriTech', content: 'New sensor data looking promising.', location: 'Gujarat', likes: 15, createdAt: Date.now() - 2000000, avatar: 'https://ui-avatars.com/api/?name=Agri&background=random' }
  ]);
  
  const [scans, setScans] = useState(() => safeJSONParse('agriverify_scans', []));

  // MOCK ACTIONS
  const login = () => {};
  const logout = () => window.location.reload();
  
  const completeProfile = async () => {};
  const updateProfile = async (updates) => setUser(prev => ({ ...prev, ...updates }));
  const togglePrivacy = () => setUser(prev => ({ ...prev, isPrivate: !prev.isPrivate }));
  
  const addPost = async (postData) => {
    const newPost = {
      id: Date.now().toString(),
      user: user.name,
      avatar: user.avatar,
      location: `${user.city}, ${user.state}`,
      likes: 0,
      createdAt: Date.now(),
      ...postData
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const addScan = (scanData) => {
    const updated = [scanData, ...scans];
    setScans(updated);
    try {
      localStorage.setItem('agriverify_scans', JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save scan to localStorage", e);
    }
  };

  const getAuthToken = async () => "demo-token";

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, logout, completeProfile, updateProfile,
      scans, addScan,
      posts, addPost,
      toggleLike: (id) => setPosts(prev => prev.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p)),
      togglePrivacy, following: [], toggleFollow: async () => {}, 
      socialGraph: {
        'user-1': { name: 'Vikram Singh', city: 'Amritsar', state: 'Punjab', avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=random' },
        'user-2': { name: 'Priya Sharma', city: 'Jaipur', state: 'Rajasthan', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=random' },
        'user-3': { name: 'Rahul Verma', city: 'Pune', state: 'Maharashtra', avatar: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=random' }
      }, 
      searchUsers: () => {}, followersCount: 124,
      comments: {}, addComment: async () => {}, fetchComments: () => {},
      getAuthToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
