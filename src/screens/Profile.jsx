import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Volume2, Globe, Shield, User as UserIcon, Award, Lock, Unlock, Camera, X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

export function Profile() {
  const { user, logout, isPrivate, togglePrivacy, updateProfile, following } = useAuth();
  const { lang, setLang, voiceGender, setVoiceGender, availableLangs, t } = useLang();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', city: '', state: '' });

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
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');
        
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
      phone: user?.phone || '', 
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 relative">
      <h1 className="text-2xl font-display font-black text-white mb-6">{t('profile_settings')}</h1>
      
      <div className="bg-agri-card border border-agri-border rounded-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-agri-green to-agri-green-dim" />
        <div className="p-4 flex flex-col gap-4">
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
              <div className="text-lg font-bold text-white flex items-center gap-2">
                {user?.name}
              </div>
              <div className="text-xs text-gray-400 mb-1">{user?.phone}</div>
              <div className="flex items-center gap-1.5 bg-agri-green/10 border border-agri-green/30 px-2 py-0.5 rounded-md inline-flex">
                <Award className="text-agri-green" size={12} />
                <span className="text-[10px] text-agri-green font-bold uppercase tracking-wider">{t('certified_partner')}</span>
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
          <div className="bg-agri-card border border-agri-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-agri-border flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-white font-semibold">
                <Globe className="text-blue-400" size={18} /> {t('app_language')}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {availableLangs.map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-colors uppercase ${lang === l ? 'bg-agri-green text-black' : 'bg-agri-card2 text-gray-400 border border-white/5'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-white font-semibold">
                <Volume2 className="text-agri-yellow" size={18} /> {t('ai_voice')}
              </div>
              <div className="flex bg-agri-bg rounded-lg p-1 border border-agri-border">
                {['Male', 'Female'].map(g => (
                  <button 
                    key={g}
                    onClick={() => setVoiceGender(g)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${voiceGender === g ? 'bg-agri-card text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
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

            <button onClick={startEditing} className="w-full p-4 border-b border-agri-border flex items-center gap-3 text-sm text-white font-semibold hover:bg-white/5 transition-colors">
              <UserIcon className="text-purple-400" size={18} /> {t('edit_profile')}
            </button>
            <button className="w-full p-4 border-b border-agri-border flex items-center gap-3 text-sm text-white font-semibold hover:bg-white/5 transition-colors">
              <Shield className="text-green-400" size={18} /> {t('data_privacy')}
            </button>
            <button 
              onClick={logout}
              className="w-full p-4 flex items-center gap-3 text-sm text-red-400 font-bold hover:bg-red-500/10 transition-colors"
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
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block">Phone</label>
                  <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white focus:border-agri-green outline-none" />
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
                  <button onClick={() => setIsEditing(false)} className="flex-1 bg-agri-card border border-agri-border py-3 rounded-xl font-bold text-gray-300">
                    {t('cancel') || 'Cancel'}
                  </button>
                  <button onClick={saveProfile} className="flex-1 bg-agri-green text-black py-3 rounded-xl font-bold flex justify-center items-center gap-2">
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
