import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Volume2, Globe, Shield, User as UserIcon, Award, Lock, Unlock, Camera, X, Check, HelpCircle, Phone, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

export function Profile({ setCurrentTab }) {
  const { user, logout, isPrivate, togglePrivacy, updateProfile } = useAuth();
  const { lang, setLang, voiceGender, setVoiceGender, availableLangs, t } = useLang();
  const fileInputRef = useRef(null);
  
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateProfile({ avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const Section = ({ title, icon: Icon, children, color }) => (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color }}>{title}</div>
      </div>
      <div className="bg-white border-2 border-gray-50 rounded-[28px] overflow-hidden shadow-xl shadow-gray-200/20">
        {children}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pb-32 bg-white min-h-full font-body">
      <h1 className="text-3xl font-display font-black text-[#1A1A40] mb-8">{t('profile_settings')}</h1>
      
      <div className="bg-white border-2 border-[#0056B3]/10 rounded-[32px] mb-10 relative overflow-hidden shadow-2xl shadow-[#0056B3]/5">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#0056B3]" />
        <div className="p-8 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#0056B3]/10 shadow-xl">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-5xl">👨🏽‍🌾</div>
              )}
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-[#0056B3] text-white p-3 rounded-full shadow-2xl border-4 border-white active:scale-90 transition-transform">
              <Camera size={18} />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
          </div>
          <div className="text-2xl font-black text-[#1A1A40] mb-2">{user?.name}</div>
          <div className="flex items-center gap-2 bg-[#008C45] text-white px-4 py-1.5 rounded-full shadow-lg shadow-[#008C45]/20">
            <Award size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('certified_partner')}</span>
          </div>
        </div>
      </div>

      <Section title={t('app_language')} icon={Globe} color="#0056B3">
        <div className="p-6 border-b border-gray-50">
          <div className="grid grid-cols-3 gap-3">
            {availableLangs.map(l => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-3 rounded-[16px] text-xs font-black transition-all uppercase ${lang === l ? 'bg-[#0056B3] text-white shadow-xl shadow-[#0056B3]/30' : 'bg-gray-50 text-gray-400 border-2 border-gray-100'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-[#1A1A40] font-black uppercase tracking-widest">
            <Volume2 size={20} className="text-[#0056B3]" /> {t('ai_voice')}
          </div>
          <div className="flex bg-gray-50 rounded-[14px] p-1.5">
            {['Male', 'Female'].map(g => (
              <button 
                key={g}
                onClick={() => setVoiceGender(g)}
                className={`px-5 py-2 rounded-[10px] text-[10px] font-black transition-all ${voiceGender === g ? 'bg-[#0056B3] text-white shadow-lg' : 'text-gray-400'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title={t('account')} icon={Shield} color="#008C45">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-[#1A1A40] font-black uppercase tracking-widest">
            {isPrivate ? <Lock size={20} className="text-[#FF6F61]" /> : <Unlock size={20} className="text-[#008C45]" />}
            {t('private_profile')}
          </div>
          <button onClick={togglePrivacy} className={`w-14 h-8 rounded-full p-1.5 transition-colors ${isPrivate ? 'bg-[#FF6F61]' : 'bg-gray-200'}`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
        <button onClick={() => setCurrentTab('support')} className="w-full p-6 border-b border-gray-50 flex items-center justify-between text-sm text-[#1A1A40] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-4"><HelpCircle size={20} className="text-[#0056B3]" /> {t('support')}</div>
          <div className="w-8 h-8 rounded-full bg-[#0056B3]/10 flex items-center justify-center text-[#0056B3]">🤖</div>
        </button>
        <button onClick={logout} className="w-full p-6 flex items-center gap-4 text-sm text-[#FF6F61] font-black uppercase tracking-widest hover:bg-[#FF6F61]/5 transition-colors">
          <LogOut size={20} /> {t('secure_logout')}
        </button>
      </Section>

      <div className="flex justify-center gap-8 opacity-20">
        <Heart size={24} className="text-[#FF6F61]" />
        <TrendingUp size={24} className="text-[#008C45]" />
        <Shield size={24} className="text-[#0056B3]" />
      </div>
    </motion.div>
  );
}
