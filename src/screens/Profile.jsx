import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Volume2, Globe, Shield, Award, Lock, Unlock, Camera, HelpCircle, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

export function Profile({ setCurrentTab }) {
  const { user, logout, isPrivate, togglePrivacy, updateProfile } = useAuth();
  const { lang, setLang, voiceGender, setVoiceGender, availableLangs, t } = useLang();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: user?.name || '', city: user?.city || '', bio: user?.bio || '' });
  
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateProfile({ avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const Section = ({ title, icon: Icon, children }) => (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className="p-2.5 bg-[#F1F8F4] rounded-[12px]">
          <Icon size={18} className="text-[#1E5128]" />
        </div>
        <div className="text-[11px] font-black text-[#1E5128] uppercase tracking-[0.2em]">{title}</div>
      </div>
      <div className="bg-white border border-[#1E5128]/10 rounded-[28px] overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 pb-40 bg-white min-h-full font-body">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-display font-black text-[#1E5128]">{t('profile_settings')}</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`p-3 rounded-[16px] transition-all ${isEditing ? 'bg-[#FF6F61] text-white' : 'bg-[#F1F8F4] text-[#1E5128]'}`}
        >
          {isEditing ? <X size={20} /> : <Edit3 size={20} />}
        </button>
      </div>
      
      {/* Profile Card */}
      <div className="bg-[#F1F8F4] border border-[#1E5128]/10 rounded-[32px] mb-10 relative overflow-hidden shadow-sm">
        <div className="p-10 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center text-5xl">👨🏽‍🌾</div>
              )}
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-[#1E6F6B] text-white p-3 rounded-[16px] shadow-2xl border-4 border-[#F1F8F4] active:scale-90 transition-all">
              <Camera size={20} />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full space-y-4">
                <input 
                  value={editData.name} 
                  onChange={e => setEditData({...editData, name: e.target.value})}
                  className="w-full bg-white border border-[#1E5128]/10 rounded-[16px] px-5 py-3 text-center text-[#1E5128] font-bold outline-none"
                  placeholder="Your Name"
                />
                <input 
                  value={editData.city} 
                  onChange={e => setEditData({...editData, city: e.target.value})}
                  className="w-full bg-white border border-[#1E5128]/10 rounded-[16px] px-5 py-3 text-center text-[#1E5128] font-bold outline-none"
                  placeholder="City, State"
                />
                <button onClick={handleSave} className="w-full bg-[#1E6F6B] text-white py-4 rounded-[16px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <Save size={18} /> Save Changes
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                <div className="text-2xl font-black text-[#1E5128] mb-1">{user?.name}</div>
                <div className="text-sm text-[#2D2D2D] opacity-40 font-bold mb-4">{user?.city || 'India'}</div>
                <div className="flex items-center gap-2 bg-[#1E5128] text-white px-5 py-2 rounded-full shadow-lg shadow-[#1E5128]/10">
                  <Award size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('certified_partner')}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Language Section */}
      <Section title={t('app_language')} icon={Globe}>
        <div className="p-6 border-b border-[#1E5128]/5">
          <div className="grid grid-cols-3 gap-4">
            {availableLangs.map(l => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-4 rounded-[18px] text-xs font-black transition-all uppercase ${lang === l ? 'bg-[#1E5128] text-white shadow-xl shadow-[#1E5128]/20' : 'bg-[#F1F8F4] text-[#1E5128] opacity-40 border border-[#1E5128]/5'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-[#1E5128] font-black uppercase tracking-widest">
            <Volume2 size={22} className="text-[#1E6F6B]" /> {t('ai_voice')}
          </div>
          <div className="flex bg-[#F1F8F4] rounded-[16px] p-2">
            {['Male', 'Female'].map(g => (
              <button 
                key={g}
                onClick={() => setVoiceGender(g)}
                className={`px-6 py-2.5 rounded-[12px] text-[10px] font-black transition-all ${voiceGender === g ? 'bg-[#1E6F6B] text-white shadow-lg' : 'text-[#1E5128] opacity-30'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Account Section */}
      <Section title={t('account')} icon={Shield}>
        <div className="p-8 border-b border-[#1E5128]/5 flex items-center justify-between">
          <div className="flex items-center gap-5 text-sm text-[#1E5128] font-black uppercase tracking-widest">
            {isPrivate ? <Lock size={22} className="text-[#1E6F6B]" /> : <Unlock size={22} className="text-[#1E6F6B]" />}
            {t('private_profile')}
          </div>
          <button onClick={togglePrivacy} className={`w-16 h-9 rounded-full p-1.5 transition-all ${isPrivate ? 'bg-[#1E5128]' : 'bg-gray-200'}`}>
            <div className={`w-6 h-6 rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>
        <button onClick={() => setCurrentTab('support')} className="w-full p-8 border-b border-[#1E5128]/5 flex items-center justify-between text-sm text-[#1E5128] font-black uppercase tracking-widest hover:bg-[#F1F8F4] transition-all">
          <div className="flex items-center gap-5"><HelpCircle size={22} className="text-[#1E6F6B]" /> {t('support')}</div>
          <div className="w-10 h-10 rounded-[14px] bg-[#1E6F6B]/10 flex items-center justify-center text-[#1E6F6B] text-xl">🤖</div>
        </button>
        <button onClick={logout} className="w-full p-8 flex items-center gap-5 text-sm text-[#2D2D2D] opacity-40 font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
          <LogOut size={22} /> {t('secure_logout')}
        </button>
      </Section>
    </motion.div>
  );
}
