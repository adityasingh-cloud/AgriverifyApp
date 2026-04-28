import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Volume2, Globe, Shield, User as UserIcon, Award, Lock, Unlock, Camera, X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

export function Profile({ setCurrentTab }) {
  const { user, logout, isPrivate, togglePrivacy, updateProfile, following } = useAuth();
  const { lang, setLang, voiceGender, setVoiceGender, availableLangs, t } = useLang();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', city: '', state: '' });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optimistic UI update
      const reader = new FileReader();
      reader.onloadend = () => updateProfile({ avatar: reader.result });
      reader.readAsDataURL(file);

      // Cloudinary Upload
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'Agriverify');
        
        const res = await fetch('https://api.cloudinary.com/v1_1/dc8suuh6h/image/upload', {
          method: 'POST',
          body: formData
        });
        
        if (res.ok) {
          const data = await res.json();
          updateProfile({ avatar: data.secure_url });
        }
      } catch (err) {
        console.warn("Cloudinary avatar upload failed.", err);
      }
    }
  };

  const startEditing = () => {
    setEditForm({ 
      name: user?.name || '', 
      city: user?.city || '', 
      state: user?.state || '' 
    });
    setIsEditing(true);
  };

  const saveProfile = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 relative bg-white min-h-full">
      <h1 className="text-2xl font-display font-black text-agri-emerald mb-6">{t('profile_settings')}</h1>
      
      <div className="bg-white border border-gray-100 rounded-[24px] mb-8 relative overflow-hidden shadow-xl shadow-gray-200/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-agri-emerald" />
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-agri-green/40">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-agri-green/20 flex items-center justify-center text-3xl">
                    {user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}
                  </div>
                )}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-agri-green text-black p-1.5 rounded-full shadow-lg border-2 border-agri-card hover:scale-110 transition-transform">
                <Camera size={12} />
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
            </div>
            <div>
              <div className="text-lg font-black text-agri-emerald flex items-center gap-2">
                {user?.name}
              </div>
              <div className="flex items-center gap-1.5 bg-agri-butter px-2 py-0.5 rounded-[8px] inline-flex">
                <Award className="text-agri-emerald" size={12} />
                <span className="text-[10px] text-agri-emerald font-black uppercase tracking-widest">{t('certified_partner')}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-6 mt-2 border-t border-white/5 pt-4">
            <div className="text-center flex-1">
              <div className="text-lg font-bold text-white">{user?.followers || 0}</div>
              <div className="text-[10px] text-gray-400 uppercase">{t('followers')}</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-lg font-bold text-white">{following.length}</div>
              <div className="text-[10px] text-gray-400 uppercase">{t('following')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pb-12">
        {/* Language Settings */}
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">{t('app_language')}</div>
          <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-50 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs text-agri-emerald font-black uppercase tracking-widest">
                <Globe className="text-agri-teal" size={18} /> {t('app_language')}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {availableLangs.map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2 py-2 rounded-[12px] text-xs font-black transition-colors uppercase ${lang === l ? 'bg-agri-emerald text-white shadow-lg shadow-agri-emerald/20' : 'bg-gray-50 text-agri-clay border border-gray-100'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-agri-emerald font-black uppercase tracking-widest">
                <Volume2 className="text-agri-clay" size={18} /> {t('ai_voice')}
              </div>
              <div className="flex bg-gray-50 rounded-[12px] p-1">
                {['Male', 'Female'].map(g => (
                  <button 
                    key={g}
                    onClick={() => setVoiceGender(g)}
                    className={`px-4 py-1.5 rounded-[10px] text-[10px] font-black transition-all ${voiceGender === g ? 'bg-white text-agri-emerald shadow-sm' : 'text-agri-clay/40'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security & Account */}
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">{t('account')}</div>
          <div className="bg-agri-card border border-agri-border rounded-2xl overflow-hidden">
            
            <div className="p-4 border-b border-agri-border flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-white font-semibold">
                {isPrivate ? <Lock className="text-gray-400" size={18} /> : <Unlock className="text-agri-green" size={18} />}
                {t('private_profile')}
              </div>
              <button 
                onClick={togglePrivacy}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isPrivate ? 'bg-agri-green' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <button onClick={startEditing} className="w-full p-4 border-b border-gray-50 flex items-center gap-3 text-xs text-agri-emerald font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
              <UserIcon className="text-agri-teal" size={18} /> {t('edit_profile')}
            </button>
            <button className="w-full p-4 border-b border-gray-50 flex items-center gap-3 text-xs text-agri-emerald font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
              <Shield className="text-agri-emerald" size={18} /> {t('data_privacy')}
            </button>
            <button 
              onClick={() => setCurrentTab('support')}
              className="w-full p-4 border-b border-gray-50 flex items-center gap-3 text-xs text-agri-emerald font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">🤖</span> {t('support') || 'Support'}
            </button>
            <button 
              onClick={logout}
              className="w-full p-4 flex items-center gap-3 text-xs text-agri-coral font-black uppercase tracking-widest hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} /> {t('secure_logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-agri-bg border border-agri-green/30 w-full max-w-sm rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(34,197,94,0.15)] flex flex-col">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-agri-card">
                <div className="font-bold text-white text-sm">{t('edit_profile')}</div>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block">Name</label>
                  <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white focus:border-agri-green outline-none" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block">City</label>
                    <input value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} className="w-full bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white focus:border-agri-green outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block">State</label>
                    <input value={editForm.state} onChange={e => setEditForm({...editForm, state: e.target.value})} className="w-full bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white focus:border-agri-green outline-none" />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 py-3 rounded-[12px] font-black text-xs text-agri-clay uppercase tracking-widest">
                    {t('cancel') || 'Cancel'}
                  </button>
                  <button onClick={saveProfile} className="flex-1 bg-agri-emerald text-white py-3 rounded-[12px] font-black text-xs uppercase tracking-widest flex justify-center items-center gap-2 shadow-lg shadow-agri-emerald/20">
                    <Check size={16} /> {t('save_changes') || 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
