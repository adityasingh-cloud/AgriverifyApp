import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const INITIAL_POSTS = [
  { id: 1, user: "Kiran Patil", location: "Solapur, MH", content: "AgriVerify AI ne meri gehun ki quality ko Gold grade diya! Got ₹6,450/q rate directly from buyer.", likes: 412, comments: 71, isLiked: false },
  { id: 2, user: "Arjun Singh", location: "Alwar, Rajasthan", content: "Mustard crop ready for harvest next week. Anyone got recent price data from Jaipur mandi? Thinking of waiting for better rates.", likes: 134, comments: 29, isLiked: false },
];

export function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPost, setNewPost] = useState('');

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      user: user?.name || "Farmer",
      location: user?.city ? `${user.city}, ${user.state}` : "India",
      content: newPost,
      likes: 0,
      comments: 0,
      isLiked: false
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const toggleLike = (id) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-agri-bg">
      <div className="p-6 pb-2 border-b border-agri-border sticky top-0 bg-agri-bg/90 backdrop-blur-md z-10">
        <h1 className="text-2xl font-display font-black text-white mb-4">AgriSocial</h1>
        
        {/* Composer */}
        <div className="bg-agri-card border border-agri-border rounded-2xl p-4 mb-4">
          <div className="flex gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-agri-green/20 flex items-center justify-center text-xl shrink-0">
              {user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}
            </div>
            <textarea 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your farming update or ask a question..."
              className="w-full bg-transparent border-none outline-none text-sm text-white resize-none h-14 placeholder-gray-500"
            />
          </div>
          <div className="flex justify-between items-center border-t border-white/5 pt-3">
            <button className="p-2 text-agri-green hover:bg-agri-green/10 rounded-lg transition-colors">
              <ImageIcon size={18} />
            </button>
            <button 
              onClick={handlePost}
              disabled={!newPost.trim()}
              className="bg-agri-green text-black font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 disabled:opacity-50"
            >
              Post <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-12">
        {posts.map(post => (
          <div key={post.id} className="bg-agri-card border border-agri-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-lg">
                🧑🏽‍🌾
              </div>
              <div>
                <div className="text-sm font-bold text-white">{post.user}</div>
                <div className="text-[10px] text-gray-500">{post.location}</div>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-6 border-t border-white/5 pt-3">
              <button 
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${post.isLiked ? 'text-red-400' : 'text-gray-400'}`}
              >
                <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} /> {post.likes}
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors">
                <MessageCircle size={16} /> {post.comments}
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors ml-auto">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
