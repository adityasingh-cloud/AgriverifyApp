import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Volume2, Globe, Shield, Award, Lock, Unlock, Camera, HelpCircle, Edit3, Save, X, User as UserIcon, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

export function Profile({ setCurrentTab }) {
  const { user, logout, isPrivate, togglePrivacy, updateProfile } = useAuth();
  const { lang, setLang, voiceGender, setVoiceGender, availableLangs, t } = useLang();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    name: user?.name || '', 
    city: user?.city || '', 
    state: user?.state || '',
    dob: user?.dob || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  
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

  const EditField = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] font-black text-[#1E5128] uppercase tracking-widest px-1 opacity-50">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E5128]/40" />
        <input 
          type={type}
          value={value} 
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white border border-[#1E5128]/10 rounded-[16px] pl-11 pr-5 py-3.5 text-sm text-[#1E5128] font-bold outline-none focus:border-[#1E6F6B] transition-colors"
        />
      </div>
    </div>
  );

  const InfoRow = ({ icon: Icon, label, value, color = "#1E5128" }) => (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</div>
        <div className="text-sm font-black text-[#2D2D2D]">{value || 'Not set'}</div>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 pb-40 bg-white min-h-full font-body">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-display font-black text-[#1E5128]">{t('profile_settings')}</h1>
        <button 
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          className={`p-3.5 rounded-[18px] transition-all flex items-center gap-2 ${isEditing ? 'bg-[#1E5128] text-white' : 'bg-[#F1F8F4] text-[#1E5128]'}`}
        >
          {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
          <span className="text-[10px] font-black uppercase tracking-widest">{isEditing ? 'Save' : 'Edit'}</span>
        </button>
      </div>
      
      {/* Profile Header Card */}
      <div className="bg-[#F1F8F4] border border-[#1E5128]/10 rounded-[36px] mb-10 relative overflow-hidden shadow-sm">
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
          <div className="text-2xl font-black text-[#1E5128] mb-1">{user?.name}</div>
          <div className="flex items-center gap-2 bg-[#1E5128] text-white px-5 py-2 rounded-full shadow-lg shadow-[#1E5128]/10">
            <Award size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('certified_partner')}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 mb-12">
            <EditField label="Full Name" icon={UserIcon} value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} placeholder="Aditya Singh" />
            <EditField label="Date of Birth" icon={Calendar} value={editData.dob} onChange={e => setEditData({...editData, dob: e.target.value})} placeholder="YYYY-MM-DD" type="date" />
            <div className="grid grid-cols-2 gap-4">
              <EditField label="State" icon={MapPin} value={editData.state} onChange={e => setEditData({...editData, state: e.target.value})} placeholder="West Bengal" />
              <EditField label="City" icon={MapPin} value={editData.city} onChange={e => setEditData({...editData, city: e.target.value})} placeholder="Kolkata" />
            </div>
            <EditField label="Phone Number" icon={Phone} value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} placeholder="+91 96749 51947" type="tel" />
            <EditField label="Email Address" icon={Mail} value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} placeholder="aditya@example.com" type="email" />
            
            <button onClick={handleSave} className="w-full bg-[#1E6F6B] text-white py-5 rounded-[20px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#1E6F6B]/20 mt-4">
              Save Profile Data
            </button>
            <button onClick={() => setIsEditing(false)} className="w-full text-[#FF6F61] font-black uppercase tracking-widest text-[10px] py-2">
              Cancel Edits
            </button>
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
      </Section>

      <button onClick={logout} className="w-full p-8 bg-[#F1F8F4] border border-[#1E5128]/5 rounded-[32px] flex items-center justify-center gap-4 text-sm text-[#2D2D2D] opacity-40 font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
        <LogOut size={22} /> {t('secure_logout')}
      </button>
    </motion.div>
  );
}
