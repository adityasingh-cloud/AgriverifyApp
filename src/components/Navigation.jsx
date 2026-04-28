import React from 'react';
import { Home, Users, Newspaper, User, Camera } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

export function Navigation({ currentTab, setCurrentTab, onCameraClick }) {
  const { t } = useLang();
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-[#1E5128]/5 px-8 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] flex justify-between items-center z-40 shadow-[0_-10px_40px_rgba(30,81,40,0.05)]">
      <NavItem icon={<Home size={28} />} label={t('dashboard')} active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} />
      <NavItem icon={<Users size={28} />} label={t('community')} active={currentTab === 'community'} onClick={() => setCurrentTab('community')} />
      
      <div className="relative -top-10">
        <button 
          onClick={onCameraClick}
          className="w-18 h-18 w-[76px] h-[76px] rounded-[24px] bg-[#1E6F6B] flex items-center justify-center shadow-2xl shadow-[#1E6F6B]/30 hover:scale-95 transition-all border-[6px] border-white"
        >
          <Camera size={34} color="white" strokeWidth={2.5} />
        </button>
      </div>

      <NavItem icon={<Newspaper size={28} />} label={t('news')} active={currentTab === 'news'} onClick={() => setCurrentTab('news')} />
      <NavItem icon={<User size={28} />} label={t('profile')} active={currentTab === 'profile'} onClick={() => setCurrentTab('profile')} />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center gap-2 transition-all ${active ? 'text-[#1E5128] scale-110' : 'text-[#2D2D2D] opacity-20'}`}
    >
      <div className="transition-transform">{icon}</div>
      <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
    </button>
  );
}
