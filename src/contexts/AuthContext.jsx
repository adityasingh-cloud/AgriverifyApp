import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    uid: 'demo-123',
    name: 'Farmer Aditya',
    email: 'adityasinghvoid0009@gmail.com',
    gender: 'Male',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agri',
    followers: 1254,
    followingCount: 89
  });

  const [scans, setScans] = useState(() => {
    const saved = localStorage.getItem('agriverify_scans');
    return saved ? JSON.parse(saved) : [];
  });

  const [posts, setPosts] = useState([
    { id: 1, user: "Rajesh Kumar", content: "Great harvest this season! Verified Grade A wheat ready for transport.", location: "Punjab", likes: 24, avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, user: "Sita Devi", content: "Organic farming pays off. My rice batch got a 92/100 quality score.", location: "Bihar", likes: 56, avatar: "https://i.pravatar.cc/150?u=2" }
  ]);

  const addScan = (scanData) => {
    const newScans = [scanData, ...scans];
    setScans(newScans);
    localStorage.setItem('agriverify_scans', JSON.stringify(newScans));
  };

  const logout = () => {
    console.log("Mock Logout triggered");
    // In demo mode, we just keep the user logged in
  };

  const updateProfile = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const togglePrivacy = () => {};
  const addPost = (post) => {
    setPosts(prev => [{ id: Date.now(), ...post, user: user.name, likes: 0 }, ...prev]);
  };
  const toggleLike = (id) => {};
  const toggleFollow = (id) => {};
  const searchUsers = () => {};
  const addComment = () => {};
  const fetchComments = () => {};

  return (
    <AuthContext.Provider value={{ 
      user, scans, posts, addScan, logout, updateProfile, 
      isPrivate: false, togglePrivacy, addPost, toggleLike, 
      following: [], toggleFollow, socialGraph: {}, searchUsers, 
      comments: {}, addComment, fetchComments 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
