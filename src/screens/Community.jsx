import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send, X, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

const MOCK_POSTS = [
  {
    id: 'm1',
    user: 'Rajesh Kumar',
    location: 'Punjab, India',
    content: 'Just finished the quality audit for my Wheat harvest. Certified Grade A+ with 11% moisture. Ready for the market! 🌾',
    likes: 24,
    avatar: '👨🏽‍🌾',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm2',
    user: 'Sita Devi',
    location: 'Haryana, India',
    content: 'Used the new sensor tool today. It is so easy to use. Highly recommend to all farmers in our cooperative. #AgriTech',
    likes: 18,
    avatar: '👩🏽‍🌾',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm3',
    user: 'Amit Singh',
    location: 'Uttar Pradesh, India',
    content: 'The market prices are looking stable today. Verified my batch ID: LV-902142-12. Fair prices guaranteed.',
    likes: 31,
    avatar: '👨🏽‍🌾',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800'
  }
];

export function Community() {
  const { user, posts: contextPosts, addPost, searchUsers, comments, fetchComments } = useAuth();
  const { t } = useLang();
  
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePostComments, setActivePostComments] = useState(null);
  
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Fallback to MOCK_POSTS if context is empty
  const displayPosts = contextPosts.length > 0 ? contextPosts : MOCK_POSTS;

  useEffect(() => {
    if (searchQuery.trim().length > 0) searchUsers(searchQuery);
  }, [searchQuery]);

  const handleFileChange = (e) => {
    console.log('File selected:', e.target.files[0]);
    // For the demo, we will just log the file and not process it to avoid crashes
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col bg-white relative min-h-full font-body">
      <div className="p-8 pb-4 border-b border-[#1E5128]/5 sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-black text-[#1E5128]">{t('community')}</h1>
          <div className="flex bg-[#F1F8F4] p-1.5 rounded-[16px]">
            <button onClick={() => setActiveTab('feed')} className={`px-5 py-2 rounded-[12px] text-xs font-black transition-all ${activeTab === 'feed' ? 'bg-[#1E5128] text-white shadow-lg' : 'text-[#1E5128] opacity-40'}`}>{t('feed')}</button>
            <button onClick={() => setActiveTab('messages')} className={`px-5 py-2 rounded-[12px] text-xs font-black transition-all ${activeTab === 'messages' ? 'bg-[#1E5128] text-white shadow-lg' : 'text-[#1E5128] opacity-40'}`}>{t('messages')}</button>
          </div>
        </div>

        {activeTab === 'feed' && (
          <>
            <div className="relative mb-8">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1E5128]/20" size={20} />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('search_users')}
                className="w-full bg-[#F1F8F4] border border-[#1E5128]/10 rounded-[20px] py-4 pl-14 pr-4 text-sm text-[#2D2D2D] font-bold focus:ring-2 focus:ring-[#1E6F6B]/10 outline-none transition-all"
              />
            </div>
            
            <div className="bg-white border border-[#1E5128]/10 rounded-[24px] p-6 mb-4 shadow-sm">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#F1F8F4] overflow-hidden shrink-0 border border-[#1E5128]/10">
                  {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-2xl">👨🏽‍🌾</div>}
                </div>
                <div className="flex-1">
                  <textarea 
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share a harvest audit..."
                    className="w-full bg-transparent border-none outline-none text-base text-[#1A1A40] font-medium resize-none h-16 placeholder:opacity-30"
                  />
                  {selectedImage && (
                    <div className="relative inline-block mt-4">
                      <img src={selectedImage} alt="preview" className="h-28 rounded-[16px] border border-[#1E5128]/10 shadow-sm" />
                      <button onClick={() => setSelectedImage(null)} className="absolute -top-3 -right-3 bg-[#1E5128] text-white rounded-full p-2 shadow-lg">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#1E5128]/5">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="p-3 text-[#1E5128] hover:bg-[#F1F8F4] rounded-[14px] transition-colors">
                  <ImageIcon size={22} />
                </button>
                <button 
                  onClick={handlePost}
                  disabled={!newPost.trim() && !selectedImage}
                  className="bg-[#1E6F6B] text-white font-black px-8 py-3 rounded-[16px] text-xs shadow-lg shadow-[#1E6F6B]/10 disabled:opacity-30"
                >
                  {t('post')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-6 space-y-6 pb-32">
        {displayPosts.map(post => (
          <div key={post.id} className="bg-white border border-[#1E5128]/10 rounded-[28px] p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-[16px] overflow-hidden border border-[#1E5128]/10 bg-[#F1F8F4] flex items-center justify-center text-2xl">
                {post.avatar.startsWith('http') ? <img src={post.avatar} className="w-full h-full object-cover" /> : post.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-black text-[#1E5128]">{post.user}</div>
                  <ShieldCheck size={14} className="text-[#1E6F6B]" />
                </div>
                <div className="text-[10px] text-[#2D2D2D] opacity-40 font-black uppercase tracking-widest">{post.location}</div>
              </div>
            </div>

            {post.content && <p className="text-base text-[#1A1A40] font-medium mb-5 leading-relaxed">{post.content}</p>}
            
            {post.image && (
              <div className="rounded-[24px] overflow-hidden border border-[#1E5128]/5 mb-5">
                <img src={post.image} alt="post" className="w-full object-cover max-h-80" />
              </div>
            )}

            <div className="flex items-center gap-8 pt-5 border-t border-[#1E5128]/5">
              <button className="flex items-center gap-2 text-xs font-black text-[#1E5128] opacity-60">
                <Heart size={20} className="text-[#1E5128]" /> {post.likes || 0}
              </button>
              <button onClick={() => openComments(post.id)} className="flex items-center gap-2 text-xs font-black text-[#1E5128] opacity-60">
                <MessageCircle size={20} className="text-[#1E5128]" /> {comments[post.id]?.length || 0}
              </button>
              <button className="flex items-center gap-2 text-xs font-black text-[#1E5128] opacity-20 ml-auto">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
