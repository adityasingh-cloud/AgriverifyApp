import React from 'react';
import { Home, Users, Camera, Newspaper, User } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

export function Navigation({ currentTab, setCurrentTab, onCameraClick }) {
  const { t } = useLang();
  return (
    <div className="fixed bottom-0 w-full bg-agri-bg/80 backdrop-blur-md border-t border-white/10 px-6 py-4 pb-8 flex justify-between items-center z-40">
      <NavItem icon={<Home size={24} />} label={t('dashboard')} active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} />
      <NavItem icon={<Users size={24} />} label={t('community')} active={currentTab === 'community'} onClick={() => setCurrentTab('community')} />
      
      <div className="relative -top-6">
        <button 
          onClick={onCameraClick}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-agri-green to-agri-green-dim flex items-center justify-center shadow-[0_8px_32px_rgba(34,197,94,0.3)] hover:scale-95 transition-transform"
        >
          <Camera size={28} color="white" />
        </button>
      </div>

      <NavItem icon={<Newspaper size={24} />} label={t('news')} active={currentTab === 'news'} onClick={() => setCurrentTab('news')} />
      <NavItem icon={<User size={24} />} label={t('profile')} active={currentTab === 'profile'} onClick={() => setCurrentTab('profile')} />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-agri-green' : 'text-gray-500'}`}
    >
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}
