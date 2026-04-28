import React from 'react';
import { Navigation } from './Navigation';

export function Layout({ children, currentTab, setCurrentTab, onCameraClick }) {
  return (
    <div className="h-full w-full bg-white flex flex-col relative overflow-hidden pb-[env(safe-area-inset-bottom)]">
      <div className={`flex-1 ${currentTab === 'support' ? 'overflow-hidden' : 'overflow-y-auto'} hide-scrollbar pb-24 touch-pan-y`} style={{ WebkitOverflowScrolling: 'touch' }}>
        {children}
      </div>
      
      <Navigation 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onCameraClick={onCameraClick} 
      />
    </div>
  );
}
