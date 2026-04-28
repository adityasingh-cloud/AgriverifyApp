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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-agri-bg relative">
      <div className="p-6 pb-2 border-b border-agri-border sticky top-0 bg-agri-bg/90 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-display font-black text-white">{t('community')}</h1>
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

            {/* Display Real-time Search Results overlay if searching */}
            {searchQuery.length > 0 && (
               <div className="absolute top-full left-6 right-6 bg-agri-card border border-agri-border rounded-xl shadow-2xl mt-2 p-2 z-20 max-h-60 overflow-y-auto">
                 {Object.keys(socialGraph).length === 0 ? (
                   <div className="text-gray-500 text-xs p-3 text-center">No users found.</div>
                 ) : Object.entries(socialGraph).map(([id, gUser]) => (
                   <button key={id} onClick={() => { setSelectedUser(id); setSearchQuery(''); }} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-left">
                     <img src={gUser.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                     <div className="flex-1">
                       <div className="text-sm font-bold text-white">{gUser.name}</div>
                       <div className="text-[10px] text-gray-400">{gUser.city ? `${gUser.city}, ${gUser.state}` : 'Farmer'}</div>
                     </div>
                   </button>
                 ))}
               </div>
            )}
            
            <div className="bg-agri-card border border-agri-border rounded-2xl p-4 mb-4 relative z-0">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-agri-green/20 overflow-hidden border border-agri-green/40 shrink-0">
                  {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xl">{user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}</div>}
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
          posts.length > 0 ? posts.map(post => (
            <div key={post.id} className="bg-agri-card border border-agri-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => post.userId !== user?.uid && setSelectedUser(post.userId)}>
                <img src={post.avatar || 'https://ui-avatars.com/api/?name=Farmer&background=475569&color=fff'} className="w-10 h-10 rounded-full border border-white/10" />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <div className="text-sm font-bold text-white hover:text-agri-green transition-colors">{post.user}</div>
                    {post.isPrivate && <Lock size={10} className="text-gray-500" />}
                  </div>
                  <div className="text-[10px] text-gray-500">{post.location}</div>
                </div>
              </div>

              {post.isPrivate && post.userId !== user?.uid && !following.includes(post.userId) ? (
                <div className="bg-black/20 border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center text-center mb-4">
                  <Lock size={32} className="text-gray-600 mb-2" />
                  <div className="text-xs font-bold text-gray-400">{t('private_content')}</div>
                  <div className="text-[10px] text-gray-600 mt-1">{t('follow_to_view')}</div>
                </div>
              ) : (
                <>
                  {post.content && <p className="text-sm text-gray-300 mb-4 leading-relaxed">{post.content}</p>}
                  {post.image && (
                    <div className="rounded-xl overflow-hidden border border-white/10 mb-4 bg-black/50 flex justify-center">
                      <img src={post.image} alt="post" className="max-h-64 object-contain" />
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center gap-6 border-t border-white/5 pt-3">
                <button 
                  onClick={() => toggleLike(post.id)}
                  disabled={post.isPrivate && post.userId !== user?.uid && !following.includes(post.userId)}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${post.isLiked ? 'text-red-400' : 'text-gray-400'} disabled:opacity-30`}
                >
                  <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} /> {post.likes || 0}
                </button>
                <button 
                  onClick={() => openComments(post.id)} 
                  disabled={post.isPrivate && post.userId !== user?.uid && !following.includes(post.userId)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                >
                  <MessageCircle size={16} /> {comments[post.id]?.length || 0}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors ml-auto">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center text-gray-500 text-sm mt-10">No live posts. Connect to Firebase to view the global feed!</div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <MessageCircle size={40} className="text-gray-600 mb-4" />
            <h3 className="text-white font-bold mb-1">Direct Messages</h3>
            <p className="text-gray-400 text-xs">Your networking conversations will appear here.</p>
          </div>
        )}
      </div>

      {/* Real-time Comments Modal */}
      <AnimatePresence>
        {activePostComments && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end justify-center"
             onClick={() => setActivePostComments(null)}
           >
             <motion.div 
               initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
               onClick={e => e.stopPropagation()}
               className="bg-agri-bg border-t border-agri-border w-full rounded-t-3xl overflow-hidden h-[70vh] flex flex-col"
             >
               <div className="p-4 border-b border-agri-border flex justify-between items-center bg-agri-card">
                 <h3 className="text-white font-bold">Comments</h3>
                 <button onClick={() => setActivePostComments(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {comments[activePostComments]?.length > 0 ? comments[activePostComments].map(c => (
                    <div key={c.id} className="flex gap-3">
                      <img src={c.avatar} className="w-8 h-8 rounded-full border border-white/10" />
                      <div className="bg-agri-card border border-white/5 rounded-2xl rounded-tl-sm p-3 flex-1">
                        <div className="text-xs font-bold text-white mb-1">{c.userName}</div>
                        <div className="text-sm text-gray-300">{c.text}</div>
                      </div>
                    </div>
                 )) : (
                   <div className="text-center text-gray-500 text-sm mt-10">No comments yet. Be the first!</div>
                 )}
               </div>

               <div className="p-4 border-t border-agri-border bg-agri-card flex gap-2">
                 <input 
                   value={newComment} onChange={e => setNewComment(e.target.value)}
                   placeholder="Add a real-time comment..."
                   className="flex-1 bg-agri-bg border border-agri-border rounded-xl px-4 py-3 text-sm text-white focus:border-agri-green outline-none"
                   onKeyPress={e => e.key === 'Enter' && submitComment()}
                 />
                 <button onClick={submitComment} disabled={!newComment.trim()} className="bg-agri-green text-black px-4 rounded-xl disabled:opacity-50"><Send size={18}/></button>
               </div>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

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
                <img src={socialGraph[selectedUser].avatar} className="w-20 h-20 rounded-full border-2 border-agri-green mb-4" />
                <h2 className="text-2xl font-display font-black text-white">{socialGraph[selectedUser].name}</h2>
                <div className="flex gap-6 mt-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{socialGraph[selectedUser].followersCount || 0}</div>
                    <div className="text-xs text-gray-400">{t('followers')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{socialGraph[selectedUser].followingCount || 0}</div>
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
                    <h3 className="text-white font-bold mb-4">Live Posts</h3>
                    {posts.filter(p => p.userId === selectedUser).length > 0 ? posts.filter(p => p.userId === selectedUser).map(p => (
                      <div key={p.id} className="bg-agri-card border border-white/5 p-4 rounded-xl mb-3">
                        <p className="text-sm text-gray-300">{p.content}</p>
                      </div>
                    )) : <div className="text-center text-gray-500 text-xs">No recent posts.</div>}
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
