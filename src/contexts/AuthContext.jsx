import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const INITIAL_POSTS = [
  { id: 1, user: "Kiran Patil", location: "Solapur, MH", content: "AgriVerify AI ne meri gehun ki quality ko Gold grade diya!", likes: 412, comments: 71, isLiked: false, userId: 'kiran123' },
  { id: 2, user: "Arjun Singh", location: "Alwar, Rajasthan", content: "Mustard crop ready for harvest next week.", likes: 134, comments: 29, isLiked: false, userId: 'arjun456' },
];

const INITIAL_GRAPH = {
  'kiran123': { name: 'Kiran Patil', followers: 1200, following: 45, isPrivate: false, avatar: 'https://ui-avatars.com/api/?name=Kiran+Patil&background=22c55e&color=fff' },
  'arjun456': { name: 'Arjun Singh', followers: 850, following: 120, isPrivate: true, avatar: 'https://ui-avatars.com/api/?name=Arjun+Singh&background=475569&color=fff' }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState([]);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  
  const [following, setFollowing] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [socialGraph, setSocialGraph] = useState(INITIAL_GRAPH);

  useEffect(() => {
    const savedUser = localStorage.getItem('agriverify_user');
    const savedScans = localStorage.getItem('agriverify_scans');
    const savedPosts = localStorage.getItem('agriverify_posts');
    const savedFollowing = localStorage.getItem('agriverify_following');
    const savedPrivacy = localStorage.getItem('agriverify_privacy');
    const savedGraph = localStorage.getItem('agriverify_graph');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedScans) setScans(JSON.parse(savedScans));
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedFollowing) setFollowing(JSON.parse(savedFollowing));
    if (savedPrivacy) setIsPrivate(savedPrivacy === 'true');
    if (savedGraph) setSocialGraph(JSON.parse(savedGraph));
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Inject auto-generated avatar if no image provided
    if (!userData.avatar) {
      userData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=1e293b&color=fff`;
    }
    setUser(userData);
    localStorage.setItem('agriverify_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setScans([]);
    setFollowing([]);
    localStorage.removeItem('agriverify_user');
    localStorage.removeItem('agriverify_scans');
    localStorage.removeItem('agriverify_following');
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('agriverify_user', JSON.stringify(updated));
  };

  const togglePrivacy = () => {
    const newStatus = !isPrivate;
    setIsPrivate(newStatus);
    localStorage.setItem('agriverify_privacy', newStatus);
  };

  const toggleFollow = (userId) => {
    const isFollowing = following.includes(userId);
    let newFollowing;
    const newGraph = { ...socialGraph };
    
    if (isFollowing) {
      newFollowing = following.filter(id => id !== userId);
      newGraph[userId].followers -= 1;
    } else {
      newFollowing = [...following, userId];
      newGraph[userId].followers += 1;
    }
    
    setFollowing(newFollowing);
    setSocialGraph(newGraph);
    localStorage.setItem('agriverify_following', JSON.stringify(newFollowing));
    localStorage.setItem('agriverify_graph', JSON.stringify(newGraph));
  };

  const addScan = (scanData) => {
    const newScans = [scanData, ...scans];
    setScans(newScans);
    localStorage.setItem('agriverify_scans', JSON.stringify(newScans));
  };

  const addPost = (post) => {
    const newPosts = [post, ...posts];
    setPosts(newPosts);
    localStorage.setItem('agriverify_posts', JSON.stringify(newPosts));
  };

  const toggleLike = (id) => {
    const newPosts = posts.map(p => {
      if (p.id === id) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    });
    setPosts(newPosts);
    localStorage.setItem('agriverify_posts', JSON.stringify(newPosts));
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, updateProfile, scans, addScan, posts, addPost, toggleLike, loading,
      isPrivate, togglePrivacy, following, toggleFollow, socialGraph
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
