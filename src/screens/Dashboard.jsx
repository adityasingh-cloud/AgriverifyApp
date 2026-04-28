import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { motion } from 'framer-motion';

const RECENT_SCANS = [
  { id: 1, crop: "Wheat", grade: "GOLD", score: 91, date: "2h ago", emoji: "🌾", color: "text-agri-yellow", bg: "bg-agri-yellow/20" },
  { id: 2, crop: "Rice", grade: "SILVER", score: 78, date: "1d ago", emoji: "🍚", color: "text-gray-400", bg: "bg-gray-500/20" },
  { id: 3, crop: "Cotton", grade: "GOLD", score: 88, date: "2d ago", emoji: "☁️", color: "text-agri-yellow", bg: "bg-agri-yellow/20" },
];

export function Dashboard() {
  const { user } = useAuth();
  const { t } = useLang();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
      className="p-5 pt-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">{t('good_morning')} 🌤️</p>
          <h1 className="text-2xl font-display font-black text-white">{user?.name || 'Farmer'}</h1>
        </div>
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-agri-green to-agri-green-dim flex items-center justify-center text-xl shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            {user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}
          </div>
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-agri-yellow border-2 border-agri-bg flex items-center justify-center">
            <span className="text-[6px] text-black font-bold">3</span>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-agri-green/15 to-agri-green/5 border border-agri-green/20 p-5 flex mb-6">
        <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-agri-green/20 blur-xl" />
        {[
          [t('total_verified'), "2.4T", "text-agri-green"],
          [t('avg_quality'), "86%", "text-agri-yellow"],
          [t('total_earned'), "₹6.2L", "text-blue-400"]
        ].map(([label, val, color], i) => (
          <div key={i} className={`flex-1 text-center ${i < 2 ? 'border-r border-white/10' : ''}`}>
            <div className={`text-xl font-black font-display ${color}`}>{val}</div>
            <div className="text-[9px] text-gray-400 mt-1 uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Scans */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-white">{t('recent_scans')}</span>
          <span className="text-xs font-semibold text-agri-green">See All</span>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {RECENT_SCANS.map(s => (
            <div key={s.id} className="flex-shrink-0 w-28 rounded-2xl bg-agri-card border border-agri-border p-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl mx-auto mb-2">{s.emoji}</div>
              <div className="text-xs font-bold text-white text-center">{s.crop}</div>
              <div className="flex justify-center mt-1.5">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>{s.grade}</span>
              </div>
              <div className="text-[10px] text-gray-500 text-center mt-1">{s.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Prices */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-white">{t('market_prices')}</span>
          <span className="flex items-center gap-1.5 px-2 py-1 bg-agri-green/20 border border-agri-green/40 rounded-full text-[9px] font-bold text-agri-green">
            <span className="w-1.5 h-1.5 rounded-full bg-agri-green animate-pulse" /> LIVE
          </span>
        </div>
        {[
          ["Wheat 🌾", "₹6,450", "+2.3%", "text-agri-green"],
          ["Rice 🍚", "₹4,820", "-0.8%", "text-red-400"],
          ["Cotton ☁️", "₹7,100", "+1.1%", "text-agri-green"]
        ].map(([crop, price, change, color]) => (
          <div key={crop} className="flex items-center p-3.5 rounded-xl bg-agri-card border border-agri-border mb-2">
            <span className="text-xl mr-3">{crop.split(' ')[1]}</span>
            <span className="flex-1 text-sm font-semibold text-white">{crop.split(' ')[0]}</span>
            <span className="text-sm font-bold text-white mr-2">{price}</span>
            <span className={`text-xs font-bold ${color}`}>{change}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
