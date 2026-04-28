import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Community() {
  const { user, posts, addPost, toggleLike } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!newPost.trim() && !selectedImage) return;
    addPost({
      id: Date.now(),
      user: user?.name || "Farmer",
      location: user?.city ? `${user.city}, ${user.state}` : "India",
      content: newPost,
      likes: 0,
      comments: 0,
      isLiked: false,
      image: selectedImage
    });
    setNewPost('');
    setSelectedImage(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-agri-bg">
      <div className="p-6 pb-2 border-b border-agri-border sticky top-0 bg-agri-bg/90 backdrop-blur-md z-10">
        <h1 className="text-2xl font-display font-black text-white mb-4">AgriSocial Feed</h1>
        
        {/* Composer */}
        <div className="bg-agri-card border border-agri-border rounded-2xl p-4 mb-4">
          <div className="flex gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-agri-green/20 flex items-center justify-center text-xl shrink-0">
              {user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}
            </div>
            <div className="flex-1">
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your certified batch or farming update..."
                className="w-full bg-transparent border-none outline-none text-sm text-white resize-none h-14 placeholder-gray-500"
              />
              {selectedImage && (
                <div className="relative inline-block mt-2">
                  <img src={selectedImage} alt="preview" className="h-20 rounded-xl border border-white/10" />
                  <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md">
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-white/5 pt-3">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
              className="hidden" 
            />
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-agri-green hover:bg-agri-green/10 rounded-lg transition-colors">
              <ImageIcon size={18} />
            </button>
            <button 
              onClick={handlePost}
              disabled={!newPost.trim() && !selectedImage}
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
            {post.content && <p className="text-sm text-gray-300 mb-4 leading-relaxed">{post.content}</p>}
            
            {post.image && (
              <div className="rounded-xl overflow-hidden border border-white/10 mb-4 bg-black/50 flex justify-center">
                <img src={post.image} alt="post" className="max-h-64 object-contain" />
              </div>
            )}

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
