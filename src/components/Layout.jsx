import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Navigation } from './Navigation';
import { RefreshCw } from 'lucide-react';

export function Layout({ children, currentTab, setCurrentTab, onCameraClick }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const containerRef = React.useRef(null);

  const handleScroll = (e) => {
    if (isRefreshing) return;
    const scrollTop = e.target.scrollTop;
    if (scrollTop < 0) {
      // Pulling down (iOS/Android bounce)
      const progress = Math.min(Math.abs(scrollTop) / 100, 1);
      setPullProgress(progress);
      
      if (progress === 1) {
        triggerRefresh();
      }
    } else {
      setPullProgress(0);
    }
  };

  const triggerRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setPullProgress(0);
    
    // Simulate re-randomizing mock data/clearing cache
    setTimeout(() => {
      setIsRefreshing(false);
      // In a real app, we'd trigger a data refetch here
      console.log("Mock Data Re-randomized. Cache Cleared.");
    }, 1500);
  };

  return (
    <div className="h-full w-full bg-white flex flex-col relative overflow-hidden pb-[env(safe-area-inset-bottom)]">
      {/* Pull to Refresh Indicator */}
      <div className="absolute top-0 left-0 w-full flex justify-center pt-4 z-50 pointer-events-none">
        {(pullProgress > 0 || isRefreshing) && (
          <motion.div 
            style={{ opacity: isRefreshing ? 1 : pullProgress, scale: isRefreshing ? 1 : pullProgress }}
            className="bg-white shadow-xl rounded-full p-2 border border-[#1E5128]/10"
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : pullProgress * 360 }}
              transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { type: "spring", stiffness: 200 }}
            >
              <RefreshCw size={20} className="text-[#1E6F6B]" />
            </motion.div>
          </motion.div>
        )}
      </div>

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className={`flex-1 ${currentTab === 'support' ? 'overflow-hidden' : 'overflow-y-auto'} hide-scrollbar pb-24 touch-pan-y transition-transform duration-300`}
        style={{ 
          WebkitOverflowScrolling: 'touch',
          transform: isRefreshing ? 'translateY(60px)' : 'translateY(0)'
        }}
      >
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
