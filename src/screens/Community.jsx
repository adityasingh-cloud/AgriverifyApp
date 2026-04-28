import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send, X, Search, Lock, UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

export function Community() {
  const { user, posts, addPost, toggleLike, following, toggleFollow, socialGraph } = useAuth();
  const { t } = useLang();
  
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'messages'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
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
      image: selectedImage,
      userId: 'currentUser'
    });
    setNewPost('');
    setSelectedImage(null);
  };

  const filteredPosts = posts.filter(p => 
    p.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.content && p.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-agri-bg">
      <div className="p-6 pb-2 border-b border-agri-border sticky top-0 bg-agri-bg/90 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-display font-black text-white">AgriSocial</h1>
          <div className="flex bg-agri-card border border-agri-border p-1 rounded-xl">
            <button onClick={() => setActiveTab('feed')} className={`px-3 py-1 rounded-lg text-xs font-bold ${activeTab === 'feed' ? 'bg-agri-green text-black' : 'text-gray-400'}`}>{t('feed')}</button>
            <button onClick={() => setActiveTab('messages')} className={`px-3 py-1 rounded-lg text-xs font-bold ${activeTab === 'messages' ? 'bg-agri-green text-black' : 'text-gray-400'}`}>{t('messages')}</button>
          </div>
        </div>

        {activeTab === 'feed' && (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('search_users')}
                className="w-full bg-agri-card border border-agri-border rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-agri-green outline-none"
              />
            </div>
            
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
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="p-2 text-agri-green hover:bg-agri-green/10 rounded-lg transition-colors">
                  <ImageIcon size={18} />
                </button>
                <button 
                  onClick={handlePost}
                  disabled={!newPost.trim() && !selectedImage}
                  className="bg-agri-green text-black font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {t('post')} <Send size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4 space-y-4 pb-12 overflow-y-auto">
        {activeTab === 'feed' ? (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-agri-card border border-agri-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => post.userId !== 'currentUser' && setSelectedUser(post.userId)}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-lg">
                  🧑🏽‍🌾
                </div>
                <div>
                  <div className="text-sm font-bold text-white hover:text-agri-green transition-colors">{post.user}</div>
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
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <MessageCircle size={40} className="text-gray-600 mb-4" />
            <h3 className="text-white font-bold mb-1">Direct Messages</h3>
            <p className="text-gray-400 text-xs">Your networking conversations will appear here.</p>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      <AnimatePresence>
        {selectedUser && socialGraph[selectedUser] && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              onClick={e => e.stopPropagation()}
              className="bg-agri-bg border-t border-agri-border w-full rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto my-3" />
              <div className="p-6 pt-2 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-3xl mb-4 border-2 border-agri-green">
                  🧑🏽‍🌾
                </div>
                <h2 className="text-2xl font-display font-black text-white">{socialGraph[selectedUser].name}</h2>
                <div className="flex gap-6 mt-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{socialGraph[selectedUser].followers}</div>
                    <div className="text-xs text-gray-400">{t('followers')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{socialGraph[selectedUser].following}</div>
                    <div className="text-xs text-gray-400">{t('following')}</div>
                  </div>
                </div>

                <div className="flex gap-3 w-full mb-6">
                  <button 
                    onClick={() => toggleFollow(selectedUser)}
                    className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors ${following.includes(selectedUser) ? 'bg-agri-card text-white border border-agri-border' : 'bg-agri-green text-black'}`}
                  >
                    {following.includes(selectedUser) ? <><UserCheck size={18} /> {t('unfollow')}</> : <><UserPlus size={18} /> {t('follow')}</>}
                  </button>
                  <button className="flex-1 bg-agri-card border border-agri-border py-3 rounded-xl font-bold text-white flex justify-center items-center gap-2">
                    <MessageCircle size={18} /> Message
                  </button>
                </div>

                {/* Privacy Lock Check */}
                {socialGraph[selectedUser].isPrivate && !following.includes(selectedUser) ? (
                  <div className="w-full flex flex-col items-center justify-center py-12 border-t border-white/5">
                    <Lock size={40} className="text-gray-600 mb-4" />
                    <h3 className="text-white font-bold mb-1">{t('private_account')}</h3>
                    <p className="text-gray-400 text-xs text-center">{t('this_account_is_private')}</p>
                  </div>
                ) : (
                  <div className="w-full border-t border-white/5 pt-4">
                    <h3 className="text-white font-bold mb-4">Recent Posts</h3>
                    {posts.filter(p => p.userId === selectedUser).map(p => (
                      <div key={p.id} className="bg-agri-card p-4 rounded-xl mb-3">
                        <p className="text-sm text-gray-300">{p.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
