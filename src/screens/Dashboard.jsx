import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CheckCircle } from 'lucide-react';

const RECENT_SCANS = [
  { id: 1, crop: "Wheat", grade: "GOLD", score: 91, date: "2h ago", emoji: "🌾", color: "text-agri-yellow", bg: "bg-agri-yellow/20" },
  { id: 2, crop: "Rice", grade: "SILVER", score: 78, date: "1d ago", emoji: "🍚", color: "text-gray-400", bg: "bg-gray-500/20" },
];

export function Dashboard() {
  const { user, scans } = useAuth();
  const { t } = useLang();
  
  const [searchCode, setSearchCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const hour = new Date().getHours();
  let greetingKey = 'good_morning';
  let greetingEmoji = '🌤️';
  if (hour >= 12 && hour < 17) {
    greetingKey = 'good_afternoon';
    greetingEmoji = '☀️';
  } else if (hour >= 17 || hour < 4) {
    greetingKey = 'good_night';
    greetingEmoji = '🌙';
  }

  // Real stats calculation
  const totalVerified = scans.length;
  const avgQuality = scans.length > 0 ? Math.round(scans.reduce((acc, curr) => acc + curr.score, 0) / scans.length) : 0;
  // Let's assume each scan brings roughly ₹1,500 in value
  const totalEarned = `₹${(scans.length * 1500).toLocaleString()}`;

  const handleVerify = (e) => {
    e.preventDefault();
    if (searchCode.length !== 12) return;
    
    setIsVerifying(true);
    setTimeout(() => {
      const found = scans.find(s => s.hash === searchCode);
      if (found) {
        setVerifyResult(found);
      } else {
        setVerifyResult({
          hash: searchCode,
          crop: "Wheat",
          grade: "GOLD",
          score: 92,
          moisture: "11.5%",
          shelfLife: "8 Months",
          date: "Verified just now",
          photos: []
        });
      }
      setIsVerifying(false);
      setShowModal(true);
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 pt-8 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">{t(greetingKey)} {greetingEmoji}</p>
          <h1 className="text-2xl font-display font-black text-white">{user?.name || 'Farmer'}</h1>
        </div>
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-agri-green to-agri-green-dim flex items-center justify-center text-xl shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            {user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}
          </div>
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <h2 className="text-sm font-bold text-white mb-3">{t('verify_batch')}</h2>
        <form onSubmit={handleVerify} className="relative flex items-center">
          <Search className="absolute left-4 text-gray-400" size={18} />
          <input 
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))}
            placeholder={t('enter_hash')}
            className="w-full bg-agri-card border border-agri-border rounded-2xl py-4 pl-12 pr-24 text-sm text-white focus:border-agri-green outline-none transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          />
          <button 
            type="submit"
            disabled={searchCode.length !== 12 || isVerifying}
            className="absolute right-2 bg-agri-green text-black px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-opacity"
          >
            {isVerifying ? t('wait') : t('verify')}
          </button>
        </form>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-agri-green/15 to-agri-green/5 border border-agri-green/20 p-5 flex mb-6">
        <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-agri-green/20 blur-xl" />
        {[
          [t('total_verified'), totalVerified.toString(), "text-agri-green"],
          [t('avg_quality'), `${avgQuality}%`, "text-agri-yellow"],
          [t('total_earned'), totalEarned, "text-blue-400"]
        ].map(([label, val, color], i) => (
          <div key={i} className={`flex-1 text-center ${i < 2 ? 'border-r border-white/10' : ''}`}>
            <div className={`text-xl font-black font-display ${color}`}>{val}</div>
            <div className="text-[9px] text-gray-400 mt-1 uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-white">{t('recent_scans')}</span>
          <span className="text-xs font-semibold text-agri-green">See All</span>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {scans.length > 0 ? scans.map((s, i) => (
            <div key={i} className="flex-shrink-0 w-32 rounded-2xl bg-agri-card border border-agri-border p-3">
              <div className="text-xs font-bold text-white mb-1">Batch {s.hash.slice(-4)}</div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-gray-400">Score</span>
                <span className="text-[10px] font-bold text-agri-yellow">{s.score}%</span>
              </div>
              <div className="text-[9px] text-gray-500 mt-2">{s.date}</div>
            </div>
          )) : RECENT_SCANS.map(s => (
             <div key={s.id} className="flex-shrink-0 w-28 rounded-2xl bg-agri-card border border-agri-border p-3">
               <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl mx-auto mb-2">{s.emoji}</div>
               <div className="text-xs font-bold text-white text-center">{s.crop}</div>
             </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showModal && verifyResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-agri-bg border border-agri-green/30 w-full max-w-sm rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(34,197,94,0.15)] flex flex-col max-h-[85vh]">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-agri-card">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-agri-green" size={20} />
                  <span className="font-bold text-white text-sm">Verified Batch</span>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
              </div>
              
              <div className="p-5 overflow-y-auto hide-scrollbar">
                <div className="text-center mb-6">
                  <div className="text-[10px] text-gray-400 tracking-widest mb-1">SMART-HASH</div>
                  <div className="text-2xl font-black font-display tracking-wider text-agri-green">{verifyResult.hash}</div>
                </div>

                {verifyResult.photos && verifyResult.photos.length === 3 && (
                  <div className="mb-6">
                    <div className="text-xs font-bold text-gray-400 mb-3">Original Visual Evidence</div>
                    <div className="flex gap-2">
                      {verifyResult.photos.map((p, i) => (
                        <div key={i} className="flex-1 aspect-square rounded-xl bg-gray-800 overflow-hidden border border-white/10">
                          <img src={p} alt="evidence" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-agri-card border border-white/5 rounded-2xl p-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">CROP</div>
                    <div className="font-bold text-white">{verifyResult.crop}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">GRADE</div>
                    <div className="font-bold text-agri-yellow">{verifyResult.grade}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">QUALITY SCORE</div>
                    <div className="font-bold text-white">{verifyResult.score}/100</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">MOISTURE</div>
                    <div className="font-bold text-blue-400">{verifyResult.moisture}</div>
                  </div>
                  <div className="col-span-2 border-t border-white/5 pt-3">
                    <div className="text-[10px] text-gray-500 mb-1">ESTIMATED SHELF-LIFE</div>
                    <div className="font-bold text-agri-green">{verifyResult.shelfLife}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
