import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Dashboard } from '../screens/Dashboard';
import { Community } from '../screens/Community';
import { News } from '../screens/News';
import { Profile } from '../screens/Profile';
import { CameraFlow } from '../screens/CameraFlow';
import { AnimatePresence } from 'framer-motion';

export function Layout() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showCamera, setShowCamera] = useState(false);

  return (
    <div className="h-full w-full bg-agri-bg flex flex-col relative overflow-hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24 touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'community' && <Community />}
        {currentTab === 'news' && <News />}
        {currentTab === 'profile' && <Profile />}
      </div>
      
      <Navigation 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onCameraClick={() => setShowCamera(true)} 
      />

      <AnimatePresence>
        {showCamera && <CameraFlow onClose={() => setShowCamera(false)} />}
      </AnimatePresence>
    </div>
  );
}
