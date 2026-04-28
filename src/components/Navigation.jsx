import React from 'react';
import { Home, Users, Newspaper, User, Camera } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

export function Navigation({ currentTab, setCurrentTab, onCameraClick }) {
  const { t } = useLang();
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex justify-between items-center z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      <NavItem icon={<Home size={26} />} label={t('dashboard')} active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} />
      <NavItem icon={<Users size={26} />} label={t('community')} active={currentTab === 'community'} onClick={() => setCurrentTab('community')} />
      
      <div className="relative -top-8">
        <button 
          onClick={onCameraClick}
          className="w-18 h-18 w-[72px] h-[72px] rounded-[16px] bg-[#0056B3] flex items-center justify-center shadow-2xl shadow-[#0056B3]/30 hover:scale-95 transition-transform border-4 border-white"
        >
          <Camera size={32} color="white" strokeWidth={2.5} />
        </button>
      </div>

      <NavItem icon={<Newspaper size={26} />} label={t('news')} active={currentTab === 'news'} onClick={() => setCurrentTab('news')} />
      <NavItem icon={<User size={26} />} label={t('profile')} active={currentTab === 'profile'} onClick={() => setCurrentTab('profile')} />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-[#0056B3] scale-110' : 'text-[#1A1A40] opacity-20'}`}
    >
      <div className="transition-transform">{icon}</div>
      <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
    </button>
  );
}
