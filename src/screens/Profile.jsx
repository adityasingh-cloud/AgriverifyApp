import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Volume2, Globe, Shield, Award, Lock, Unlock, Camera, HelpCircle, Edit3, Save, X, User as UserIcon, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

// Define components outside to prevent focus loss during state updates
const Section = ({ title, icon: Icon, children }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-4 px-2">
      <div className="p-2.5 bg-white rounded-[12px] shadow-sm">
        <Icon size={18} className="text-[#1E5128]" />
      </div>
      <div className="text-[11px] font-black text-[#1E5128] uppercase tracking-[0.2em]">{title}</div>
    </div>
    <div className="bg-white border border-[#1E5128]/10 rounded-[28px] overflow-hidden shadow-sm">
      {children}
    </div>
  </div>
);

const EditField = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }) => (
  <div className="flex flex-col gap-1.5 px-6 py-3 border-b border-gray-50 last:border-none">
    <label className="text-[9px] font-black text-[#1E5128] opacity-50 uppercase tracking-widest px-1">{label}</label>
    <div className="relative">
      <Icon size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#1E5128]/40" />
      <input 
        type={type}
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent pl-8 pr-2 py-2 text-sm text-[#1E5128] font-bold outline-none focus:text-[#1E6F6B]"
      />
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, color = "#1E5128" }) => (
  <div className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none">
    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
      <Icon size={18} style={{ color }} />
    </div>
    <div>
      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</div>
      <div className="text-sm font-black text-[#2D2D2D]">{value || 'Not set'}</div>
    </div>
  </div>
);

export function Profile({ setCurrentTab }) {
  const { user, logout, isPrivate, togglePrivacy, updateProfile } = useAuth();
  const { lang, setLang, voiceGender, setVoiceGender, availableLangs, t } = useLang();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for editing to ensure smooth input
  const [editData, setEditData] = useState({ 
    name: '', city: '', state: '', dob: '', phone: '', email: ''
  });

  // Sync editData when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditData({
        name: user?.name || '',
        city: user?.city || '',
        state: user?.state || '',
        dob: user?.dob || '',
        phone: user?.phone || '',
        email: user?.email || ''
      });
    }
  }, [isEditing, user]);

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

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      window.location.reload(); // Hard reset for demo
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 pb-40 min-h-full font-body">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-display font-black text-[#1E5128]">{t('profile_settings')}</h1>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`p-3.5 rounded-[18px] transition-all flex items-center gap-2 ${isEditing ? 'bg-[#1E5128] text-white shadow-xl shadow-[#1E5128]/20' : 'bg-white text-[#1E5128] shadow-md'}`}
        >
          {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
          <span className="text-[10px] font-black uppercase tracking-widest">{isEditing ? 'Save' : 'Edit'}</span>
        </button>
      </div>
      
      {/* Profile Card */}
      <div className="bg-white border border-[#1E5128]/10 rounded-[36px] mb-10 relative overflow-hidden shadow-xl shadow-blue-900/5">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#1E5128]" />
        <div className="p-10 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-5xl">👨🏽‍🌾</div>
              )}
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-[#1E6F6B] text-white p-3 rounded-[16px] shadow-2xl border-4 border-white active:scale-90 transition-all">
              <Camera size={20} />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
          </div>
          <div className="text-2xl font-black text-[#1E5128] mb-1">{user?.name}</div>
          <div className="flex items-center gap-2 bg-[#1E5128] text-white px-5 py-2 rounded-full shadow-lg shadow-[#1E5128]/10">
            <Award size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('certified_partner')}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="bg-white border border-[#1E5128]/10 rounded-[32px] overflow-hidden shadow-sm mb-12"
          >
            <EditField label="Full Name" icon={UserIcon} value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} placeholder="Aditya Singh" />
            <EditField label="Date of Birth" icon={Calendar} value={editData.dob} onChange={e => setEditData({...editData, dob: e.target.value})} placeholder="YYYY-MM-DD" type="date" />
            <EditField label="State" icon={MapPin} value={editData.state} onChange={e => setEditData({...editData, state: e.target.value})} placeholder="West Bengal" />
            <EditField label="City" icon={MapPin} value={editData.city} onChange={e => setEditData({...editData, city: e.target.value})} placeholder="Kolkata" />
            <EditField label="Phone Number" icon={Phone} value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} placeholder="+91 96749 51947" type="tel" />
            <EditField label="Email Address" icon={Mail} value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} placeholder="aditya@example.com" type="email" />
            
            <div className="p-6">
              <button onClick={handleSave} className="w-full bg-[#1E6F6B] text-white py-4 rounded-[16px] font-black uppercase tracking-[0.1em] shadow-lg shadow-[#1E6F6B]/20">
                Confirm Profile Update
              </button>
              <button onClick={() => setIsEditing(false)} className="w-full text-[#FF6F61] font-black uppercase tracking-widest text-[9px] mt-4 opacity-60">
                Cancel Changes
              </button>
            </div>
          </motion.div>
        ) : (
          <Section title="Farmer Identity" icon={UserIcon}>
             <InfoRow icon={UserIcon} label="Name" value={user?.name} />
             <InfoRow icon={Calendar} label="Date of Birth" value={user?.dob} />
             <InfoRow icon={MapPin} label="Location" value={`${user?.city}, ${user?.state}`} />
             <InfoRow icon={Phone} label="Phone" value={user?.phone} />
             <InfoRow icon={Mail} label="Email" value={user?.email} />
          </Section>
        )}
      </AnimatePresence>

      <Section title={t('app_language')} icon={Globe}>
        <div className="p-6 border-b border-gray-50">
          <div className="grid grid-cols-3 gap-4">
            {availableLangs.map(l => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-4 rounded-[18px] text-xs font-black transition-all uppercase ${lang === l ? 'bg-[#1E5128] text-white shadow-xl shadow-[#1E5128]/20' : 'bg-gray-50 text-[#1E5128] opacity-40 border border-gray-100'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <button 
        onClick={handleLogout}
        className="w-full p-8 bg-white border border-[#1E5128]/10 rounded-[32px] flex items-center justify-center gap-4 text-sm text-[#FF6F61] font-black uppercase tracking-widest shadow-xl shadow-red-900/5 hover:bg-red-50 transition-all"
      >
        <LogOut size={22} /> {t('secure_logout')}
      </button>
    </motion.div>
  );
}
