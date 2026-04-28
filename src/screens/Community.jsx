import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send, X, Search, Lock, UserPlus, UserCheck, ShieldCheck } from 'lucide-react';
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
    if (searchQuery.trim().length > 0) searchUsers(searchQuery);
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
    addPost({ content: newPost, image: selectedImage });
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col bg-white relative min-h-full font-body">
      <div className="p-6 pb-2 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-display font-black text-[#1A1A40]">{t('community')}</h1>
          <div className="flex bg-gray-50 p-1 rounded-[12px]">
            <button onClick={() => setActiveTab('feed')} className={`px-4 py-1.5 rounded-[8px] text-xs font-black transition-all ${activeTab === 'feed' ? 'bg-[#0056B3] text-white shadow-lg' : 'text-gray-400'}`}>{t('feed')}</button>
            <button onClick={() => setActiveTab('messages')} className={`px-4 py-1.5 rounded-[8px] text-xs font-black transition-all ${activeTab === 'messages' ? 'bg-[#008C45] text-white shadow-lg' : 'text-gray-400'}`}>{t('messages')}</button>
          </div>
        </div>

        {activeTab === 'feed' && (
          <>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('search_users')}
                className="w-full bg-gray-50 border-none rounded-[16px] py-4 pl-12 pr-4 text-sm text-[#1A1A40] font-bold focus:ring-2 focus:ring-[#0056B3]/10 outline-none"
              />
            </div>
            
            <div className="bg-white border-2 border-gray-50 rounded-[24px] p-5 mb-6 shadow-xl shadow-gray-200/20">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#0056B3]/10 overflow-hidden shrink-0 border-2 border-[#0056B3]/5">
                  {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-2xl">👨🏽‍🌾</div>}
                </div>
                <div className="flex-1">
                  <textarea 
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your certified batch or update..."
                    className="w-full bg-transparent border-none outline-none text-base text-[#1A1A40] font-medium resize-none h-16 placeholder-gray-400"
                  />
                  {selectedImage && (
                    <div className="relative inline-block mt-3">
                      <img src={selectedImage} alt="preview" className="h-24 rounded-[12px] border-2 border-gray-100 shadow-md" />
                      <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-[#FF6F61] text-white rounded-full p-1.5 shadow-lg">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-[#0056B3] hover:bg-[#0056B3]/5 rounded-[12px] transition-colors">
                  <ImageIcon size={24} />
                </button>
                <button 
                  onClick={handlePost}
                  disabled={!newPost.trim() && !selectedImage}
                  className="bg-[#008C45] text-white font-black px-6 py-2.5 rounded-[12px] text-xs shadow-lg shadow-[#008C45]/20 disabled:opacity-30 active:scale-95 transition-transform"
                >
                  {t('post')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-5 space-y-5 pb-24">
        {posts.map(post => (
          <div key={post.id} className="bg-white border-2 border-gray-50 rounded-[24px] p-5 shadow-xl shadow-gray-200/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
                <img src={post.avatar} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="text-sm font-black text-[#1A1A40]">{post.user}</div>
                  <ShieldCheck size={14} className="text-[#008C45]" />
                </div>
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{post.location}</div>
              </div>
            </div>

            {post.content && <p className="text-base text-[#1A1A40] font-medium mb-4 leading-relaxed">{post.content}</p>}
            
            {post.image && (
              <div className="rounded-[20px] overflow-hidden border-2 border-gray-50 mb-4 shadow-sm">
                <img src={post.image} alt="post" className="w-full object-cover max-h-72" />
              </div>
            )}

            <div className="flex items-center gap-8 pt-4 border-t border-gray-50">
              <button className="flex items-center gap-2 text-xs font-black text-[#FF6F61] transition-all">
                <Heart size={22} fill="#FF6F61" className="opacity-20" /> {post.likes || 0}
              </button>
              <button onClick={() => openComments(post.id)} className="flex items-center gap-2 text-xs font-black text-[#0056B3] hover:text-black transition-colors">
                <MessageCircle size={22} className="opacity-20" /> {comments[post.id]?.length || 0}
              </button>
              <button className="flex items-center gap-2 text-xs font-black text-[#008C45] hover:text-black transition-colors ml-auto">
                <Share2 size={22} className="opacity-20" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
