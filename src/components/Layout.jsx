import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Navigation } from './Navigation';
import { RefreshCw, CheckCircle } from 'lucide-react';

export function Layout({ children, currentTab, setCurrentTab, onCameraClick }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const pullThreshold = 100;
  const startY = useRef(0);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    if (containerRef.current.scrollTop <= 0) {
      startY.current = e.touches[0].pageY;
    }
  };

  const handleTouchMove = (e) => {
    if (isRefreshing || containerRef.current.scrollTop > 0) return;
    
    const touchY = e.touches[0].pageY;
    const diff = touchY - startY.current;
    
    if (diff > 0) {
      const progress = Math.min(diff / pullThreshold, 1.2);
      setPullProgress(progress);
    }
  };

  const handleTouchEnd = () => {
    if (isRefreshing) return;
    
    if (pullProgress >= 1) {
      triggerRefresh();
    } else {
      setPullProgress(0);
    }
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setPullProgress(0);
    
    setTimeout(() => {
      setIsRefreshing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      console.log("System Audit Refreshed. Cache Purged.");
    }, 1500);
  };

  return (
    <div 
      className="h-full w-full bg-[#F0F7FF] flex flex-col relative overflow-hidden pb-[env(safe-area-inset-bottom)]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh UI */}
      <div className="absolute top-0 left-0 w-full flex justify-center pt-8 z-50 pointer-events-none">
        <AnimatePresence>
          {(pullProgress > 0 || isRefreshing || showSuccess) && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white shadow-2xl rounded-full p-3 border-2 border-[#1E5128]/5 flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : pullProgress * 180 }}
                transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
              >
                {showSuccess ? <CheckCircle size={20} className="text-[#008C45]" /> : <RefreshCw size={20} className="text-[#1E6F6B]" />}
              </motion.div>
              {(isRefreshing || showSuccess) && (
                <span className="text-[10px] font-black text-[#1E5128] uppercase tracking-widest pr-2">
                  {showSuccess ? "Audit Updated" : "Refreshing"}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div 
        ref={containerRef}
        className={`flex-1 ${currentTab === 'support' ? 'overflow-hidden' : 'overflow-y-auto'} hide-scrollbar pb-32 touch-pan-y transition-transform duration-300 ease-out`}
        style={{ 
          WebkitOverflowScrolling: 'touch',
          transform: pullProgress > 0 ? `translateY(${pullProgress * 50}px)` : (isRefreshing ? 'translateY(60px)' : 'translateY(0)')
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
