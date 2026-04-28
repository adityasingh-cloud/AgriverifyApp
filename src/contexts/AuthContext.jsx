import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const INITIAL_POSTS = [
  { id: 1, user: "Kiran Patil", location: "Solapur, MH", content: "AgriVerify AI ne meri gehun ki quality ko Gold grade diya! Got ₹6,450/q rate directly from buyer.", likes: 412, comments: 71, isLiked: false },
  { id: 2, user: "Arjun Singh", location: "Alwar, Rajasthan", content: "Mustard crop ready for harvest next week. Anyone got recent price data from Jaipur mandi? Thinking of waiting for better rates.", likes: 134, comments: 29, isLiked: false },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState([]);
  const [posts, setPosts] = useState(INITIAL_POSTS);

  useEffect(() => {
    const savedUser = localStorage.getItem('agriverify_user');
    const savedScans = localStorage.getItem('agriverify_scans');
    const savedPosts = localStorage.getItem('agriverify_posts');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedScans) setScans(JSON.parse(savedScans));
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('agriverify_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setScans([]);
    localStorage.removeItem('agriverify_user');
    localStorage.removeItem('agriverify_scans');
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
    <AuthContext.Provider value={{ user, login, logout, scans, addScan, posts, addPost, toggleLike, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
