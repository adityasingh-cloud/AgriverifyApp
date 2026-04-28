import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Volume2, Globe, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

export function Profile() {
  const { user, logout } = useAuth();
  const { lang, setLang, voiceGender, setVoiceGender, availableLangs } = useLang();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <h1 className="text-2xl font-display font-black text-white mb-6">Profile Settings</h1>
      
      <div className="flex items-center gap-4 bg-agri-card border border-agri-border p-4 rounded-2xl mb-8">
        <div className="w-16 h-16 rounded-full bg-agri-green/20 border border-agri-green/40 flex items-center justify-center text-3xl">
          {user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}
        </div>
        <div>
          <div className="text-lg font-bold text-white">{user?.name}</div>
          <div className="text-xs text-gray-400">{user?.phone}</div>
          <div className="text-xs text-agri-green font-semibold mt-1">{user?.city}, {user?.state}</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Language Settings */}
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Language & Voice</div>
          <div className="bg-agri-card border border-agri-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-agri-border flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-white font-semibold">
                <Globe className="text-blue-400" size={18} /> App Language
              </div>
              <div className="flex flex-wrap gap-2">
                {availableLangs.map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${lang === l ? 'bg-agri-green text-black' : 'bg-agri-card2 text-gray-400 border border-white/5'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-white font-semibold">
                <Volume2 className="text-agri-yellow" size={18} /> AI Voice Assistant
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
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Account</div>
          <div className="bg-agri-card border border-agri-border rounded-2xl overflow-hidden">
            <button className="w-full p-4 border-b border-agri-border flex items-center gap-3 text-sm text-white font-semibold hover:bg-white/5 transition-colors">
              <UserIcon className="text-purple-400" size={18} /> Edit Profile Info
            </button>
            <button className="w-full p-4 border-b border-agri-border flex items-center gap-3 text-sm text-white font-semibold hover:bg-white/5 transition-colors">
              <Shield className="text-green-400" size={18} /> Data & Privacy Settings
            </button>
            <button 
              onClick={logout}
              className="w-full p-4 flex items-center gap-3 text-sm text-red-400 font-bold hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={18} /> Secure Logout
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
