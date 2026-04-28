import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send, X, Search, Lock, UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

export function Community() {
  const { user, posts, addPost, toggleLike, following, toggleFollow, socialGraph, searchUsers, comments, addComment, fetchComments } = useAuth();
  const { t } = useLang();
  
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activePostComments, setActivePostComments] = useState(null);
  const [newComment, setNewComment] = useState('');
  
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      searchUsers(searchQuery);
    }
  }, [searchQuery]);

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
      content: newPost,
      image: selectedImage
    });
    setNewPost('');
    setSelectedImage(null);
  };

  const openComments = (postId) => {
    setActivePostComments(postId);
    fetchComments(postId);
  };

  const submitComment = () => {
    if (!newComment.trim() || !activePostComments) return;
    addComment(activePostComments, newComment);
    setNewComment('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col bg-agri-bg relative min-h-full">
      <div className="p-6 pb-2 border-b border-gray-200 sticky top-0 bg-agri-bg/95 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-display font-black text-black">{t('community')}</h1>
          <div className="flex bg-white border-2 border-black/5 p-1 rounded-[12px] shadow-sm">
            <button onClick={() => setActiveTab('feed')} className={`px-4 py-1.5 rounded-[8px] text-xs font-black transition-all ${activeTab === 'feed' ? 'bg-black text-white' : 'text-gray-500'}`}>{t('feed')}</button>
            <button onClick={() => setActiveTab('messages')} className={`px-4 py-1.5 rounded-[8px] text-xs font-black transition-all ${activeTab === 'messages' ? 'bg-black text-white' : 'text-gray-500'}`}>{t('messages')}</button>
          </div>
        </div>

        {activeTab === 'feed' && (
          <>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('search_users')}
                className="w-full bg-white border-2 border-black/5 rounded-[12px] py-3 pl-12 pr-4 text-sm text-black font-black placeholder-gray-400 focus:border-black outline-none"
              />
            </div>
            
            <div className="bg-white border-2 border-black/5 rounded-[24px] p-5 mb-6 shadow-xl shadow-gray-200/20">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0 border-2 border-black/5">
                  {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-2xl">{user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}</div>}
                </div>
                <div className="flex-1">
                  <textarea 
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your certified batch or update..."
                    className="w-full bg-transparent border-none outline-none text-sm text-black font-medium resize-none h-16 placeholder-gray-400"
                  />
                  {selectedImage && (
                    <div className="relative inline-block mt-3">
                      <img src={selectedImage} alt="preview" className="h-24 rounded-[12px] border-2 border-black/5 shadow-md" />
                      <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1.5 shadow-lg border-2 border-white">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-black hover:bg-gray-100 rounded-[12px] transition-colors">
                  <ImageIcon size={20} />
                </button>
                <button 
                  onClick={handlePost}
                  disabled={!newPost.trim() && !selectedImage}
                  className="bg-black text-white font-black px-6 py-2.5 rounded-[12px] text-xs shadow-lg shadow-black/20 disabled:opacity-30 active:scale-95 transition-transform"
                >
                  {t('post')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-5 space-y-5 pb-24">
        {activeTab === 'feed' ? (
          posts.length > 0 ? posts.map(post => (
            <div key={post.id} className="bg-white border-2 border-black/5 rounded-[24px] p-5 shadow-xl shadow-gray-200/20">
              <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => post.userId !== user?.uid && setSelectedUser(post.userId)}>
                <img src={post.avatar || 'https://ui-avatars.com/api/?name=Farmer&background=000&color=fff'} className="w-12 h-12 rounded-full border-2 border-black/5" />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <div className="text-sm font-black text-black">{post.user}</div>
                    {post.isPrivate && <Lock size={12} className="text-gray-400" />}
                  </div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{post.location}</div>
                </div>
              </div>

              {post.isPrivate && post.userId !== user?.uid && !following.includes(post.userId) ? (
                <div className="bg-gray-50 rounded-[20px] py-12 flex flex-col items-center justify-center text-center mb-4">
                  <Lock size={32} className="text-black mb-3 opacity-20" />
                  <div className="text-xs font-black text-black uppercase tracking-widest">{t('private_content')}</div>
                </div>
              ) : (
                <>
                  {post.content && <p className="text-sm text-black font-medium mb-4 leading-relaxed">{post.content}</p>}
                  {post.image && (
                    <div className="rounded-[20px] overflow-hidden border-2 border-black/5 mb-4 shadow-sm">
                      <img src={post.image} alt="post" className="w-full object-cover max-h-72" />
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center gap-8 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => toggleLike(post.id)}
                  disabled={post.isPrivate && post.userId !== user?.uid && !following.includes(post.userId)}
                  className={`flex items-center gap-2 text-xs font-black transition-all ${post.isLiked ? 'text-black scale-110' : 'text-gray-300'} disabled:opacity-30`}
                >
                  <Heart size={20} fill={post.isLiked ? "black" : "none"} /> {post.likes || 0}
                </button>
                <button 
                  onClick={() => openComments(post.id)} 
                  disabled={post.isPrivate && post.userId !== user?.uid && !following.includes(post.userId)}
                  className="flex items-center gap-2 text-xs font-black text-gray-300 hover:text-black transition-colors disabled:opacity-30"
                >
                  <MessageCircle size={20} /> {comments[post.id]?.length || 0}
                </button>
                <button className="flex items-center gap-2 text-xs font-black text-gray-300 hover:text-black transition-colors ml-auto">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center text-black font-black text-sm mt-10 opacity-30">No live posts.</div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MessageCircle size={48} className="text-black opacity-10 mb-4" />
            <h3 className="text-black font-black uppercase tracking-widest mb-1">Messages</h3>
            <p className="text-gray-500 text-xs font-bold">Your private conversations will appear here.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
