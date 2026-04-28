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
      const reader = new FileReader();
      reader.onloadend = () => updateProfile({ avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const startEditing = () => {
    setEditForm({ name: user?.name || '', city: user?.city || '', state: user?.state || '' });
    setIsEditing(true);
  };

  const saveProfile = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 relative text-[#0056B3] min-h-full">
      <h1 className="text-3xl font-display font-black text-black mb-8">{t('profile_settings')}</h1>
      
      <div className="bg-white border-2 border-black/5 rounded-[28px] mb-10 relative overflow-hidden shadow-2xl shadow-gray-200/20">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-black" />
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-black/5 shadow-inner">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">
                    {user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}
                  </div>
                )}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-black text-white p-2 rounded-full shadow-xl border-2 border-white hover:scale-110 transition-transform">
                <Camera size={14} />
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
            </div>
            <div>
              <div className="text-xl font-black text-black mb-1">
                {user?.name}
              </div>
              <div className="flex items-center gap-2 bg-black text-white px-3 py-1 rounded-[8px] inline-flex shadow-lg shadow-black/10">
                <Award size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">{t('certified_partner')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10 pb-24">
        <div>
          <div className="text-[11px] font-black text-black uppercase tracking-[0.2em] mb-4 opacity-40 px-2">{t('app_language')}</div>
          <div className="bg-white border-2 border-black/5 rounded-[28px] overflow-hidden shadow-sm">
            <div className="p-6 border-b-2 border-gray-50 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-xs text-black font-black uppercase tracking-widest">
                <Globe size={20} /> {t('app_language')}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {availableLangs.map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-3 rounded-[14px] text-xs font-black transition-all uppercase ${lang === l ? 'bg-black text-white shadow-xl shadow-black/20' : 'bg-gray-50 text-black/30 border-2 border-black/5'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-black font-black uppercase tracking-widest">
                <Volume2 size={20} /> {t('ai_voice')}
              </div>
              <div className="flex bg-gray-50 rounded-[14px] p-1.5 border-2 border-black/5">
                {['Male', 'Female'].map(g => (
                  <button 
                    key={g}
                    onClick={() => setVoiceGender(g)}
                    className={`px-5 py-2 rounded-[10px] text-[10px] font-black transition-all ${voiceGender === g ? 'bg-black text-white shadow-lg' : 'text-black/30'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-black text-black uppercase tracking-[0.2em] mb-4 opacity-40 px-2">{t('account')}</div>
          <div className="bg-white border-2 border-black/5 rounded-[28px] overflow-hidden shadow-sm">
            
            <div className="p-6 border-b-2 border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-black font-black uppercase tracking-widest">
                {isPrivate ? <Lock size={20} /> : <Unlock size={20} />}
                {t('private_profile')}
              </div>
              <button onClick={togglePrivacy} className={`w-14 h-8 rounded-full p-1.5 transition-colors ${isPrivate ? 'bg-black' : 'bg-gray-200'}`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <button onClick={startEditing} className="w-full p-6 border-b-2 border-gray-50 flex items-center gap-4 text-xs text-black font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
              <UserIcon size={20} /> {t('edit_profile')}
            </button>
            <button onClick={() => setCurrentTab('support')} className="w-full p-6 border-b-2 border-gray-50 flex items-center gap-4 text-xs text-black font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
              <span className="text-2xl">🤖</span> {t('support')}
            </button>
            <button onClick={logout} className="w-full p-6 flex items-center gap-4 text-xs text-red-600 font-black uppercase tracking-widest hover:bg-red-50 transition-colors">
              <LogOut size={20} /> {t('secure_logout')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
