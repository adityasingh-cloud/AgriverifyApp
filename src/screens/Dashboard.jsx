import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CheckCircle, Info, TrendingUp, ShieldCheck, AlertCircle, Trash2, ArrowUpRight, HelpCircle } from 'lucide-react';
import { MOCK_INSIGHTS, TOOLTIPS } from '../mockData';

export function Dashboard() {
  const { user, scans } = useAuth();
  const { t, lang } = useLang();
  
  const [searchCode, setSearchCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const hour = new Date().getHours();
  let greetingKey = 'good_morning';
  let greetingEmoji = '🌤️';
  if (hour >= 12 && hour < 17) { greetingKey = 'good_afternoon'; greetingEmoji = '☀️'; }
  else if (hour >= 17 || hour < 4) { greetingKey = 'good_night'; greetingEmoji = '🌙'; }

  const totalVerified = scans.length;
  const avgQuality = scans.length > 0 ? Math.round(scans.reduce((acc, curr) => acc + curr.score, 0) / scans.length) : 0;
  const totalEarned = `₹${(scans.length * 1500).toLocaleString()}`;

  const handleVerify = (e) => {
    e.preventDefault();
    if (searchCode.length !== 12) return;
    setIsVerifying(true);
    setTimeout(() => {
      const found = scans.find(s => s.hash === searchCode);
      setVerifyResult(found || { hash: searchCode, crop: "Wheat", grade: "GOLD", score: 92, moisture: "11.5%", shelfLife: "8 Months", date: "Verified just now", photos: [] });
      setIsVerifying(false);
      setShowModal(true);
    }, 1000);
  };

  const BentoCard = ({ title, icon: Icon, children, tooltipKey, className = "" }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`relative bg-white/40 backdrop-blur-xl border border-white/40 p-5 rounded-[24px] shadow-sm flex flex-col ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2.5 bg-white/60 rounded-2xl shadow-sm">
          <Icon size={20} className="text-agri-green" />
        </div>
        <button onClick={() => setActiveTooltip(tooltipKey)} className="text-gray-400 hover:text-agri-green transition-colors">
          <HelpCircle size={18} />
        </button>
      </div>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex-1">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-full bg-[#f8faf7] p-5 pt-4 pb-24 font-body">
      {/* Alert Banner */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="mb-6 bg-red-50 border border-red-100 p-4 rounded-[24px] flex items-center gap-3 shadow-sm"
      >
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
          <AlertCircle className="text-red-500" size={20} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">District Alert</p>
          <p className="text-xs font-bold text-red-900">High Fungus Risk detected in Hooghly area</p>
        </div>
        <ArrowUpRight size={16} className="text-red-300" />
      </motion.div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-xs text-gray-400 mb-1 font-medium">{t(greetingKey)} {greetingEmoji}</p>
          <h1 className="text-2xl font-display font-black text-gray-900">{user?.name || 'Farmer'}</h1>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-white flex items-center justify-center text-2xl">
          {user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="bg-white border border-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-bold text-gray-800">{t('verify_batch')}</h2>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-agri-green" />
            <div className="w-1.5 h-1.5 rounded-full bg-agri-green/20" />
          </div>
        </div>
        
        <form onSubmit={handleVerify} className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))}
            placeholder={t('enter_hash')}
            className="w-full bg-[#f3f6f2] border-none rounded-2xl py-4 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-agri-green/20 outline-none"
          />
          <button 
            type="submit"
            disabled={searchCode.length !== 12 || isVerifying}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-agri-green text-black px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-agri-green/20 disabled:opacity-30"
          >
            {isVerifying ? '...' : t('verify')}
          </button>
        </form>

        <div className="flex justify-between pt-4 border-t border-gray-50">
          <div className="text-center">
            <div className="text-lg font-black text-gray-900">{totalVerified}</div>
            <div className="text-[9px] text-gray-400 uppercase font-bold">{t('total_verified')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-agri-green">{avgQuality}%</div>
            <div className="text-[9px] text-gray-400 uppercase font-bold">{t('avg_quality')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-blue-500">{totalEarned}</div>
            <div className="text-[9px] text-gray-400 uppercase font-bold">{t('total_earned')}</div>
          </div>
        </div>
      </div>

      {/* Advanced Bento Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Card 1: Market FairPlay */}
        <BentoCard title="Market FairPlay" icon={TrendingUp} tooltipKey="fairplay">
          <div className="flex flex-col">
            <div className="text-sm font-black text-gray-900 mb-1">{MOCK_INSIGHTS.marketIndex.currentPrice}</div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[10px] bg-agri-green/10 text-agri-green px-1.5 py-0.5 rounded font-bold">Grade {MOCK_INSIGHTS.marketIndex.qualityGrade}</span>
              <ShieldCheck size={12} className="text-agri-green" />
            </div>
            <div className="text-[9px] text-gray-400 leading-tight">Fair value detected at {MOCK_INSIGHTS.marketIndex.fairPrice}</div>
          </div>
        </BentoCard>

        {/* Card 2: Agri-Credit Score */}
        <BentoCard title="Agri-Credit" icon={CheckCircle} tooltipKey="credit">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 flex items-center justify-center mb-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * 0.87)} className="text-agri-green" />
              </svg>
              <span className="absolute text-[10px] font-black text-gray-900">{MOCK_INSIGHTS.creditScore}</span>
            </div>
            <button className="text-[8px] bg-gray-900 text-white px-2 py-1.5 rounded-lg font-bold w-full uppercase tracking-tighter">Apply for Loan</button>
          </div>
        </BentoCard>

        {/* Card 3: Pest Radar */}
        <BentoCard title="Pest Radar" icon={AlertCircle} tooltipKey="pest">
          <div className="h-20 bg-[#e8f0e6] rounded-xl relative overflow-hidden flex items-center justify-center border border-white/20">
             <div className="absolute w-4 h-4 bg-red-500/20 rounded-full animate-ping" />
             <div className="absolute w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
             <div className="text-[8px] font-bold text-gray-500 absolute bottom-2">Local Radar Active</div>
          </div>
        </BentoCard>

        {/* Card 4: Value Recovery */}
        <BentoCard title="Value Recovery" icon={Trash2} tooltipKey="recovery">
          <div className="flex flex-col h-full justify-between">
            <div className="text-[10px] text-gray-500 leading-tight mb-2">Have rejected crops?</div>
            <div className="space-y-1">
              <div className="bg-white/60 p-1.5 rounded-lg border border-white/40 flex justify-between items-center">
                <span className="text-[9px] font-bold text-gray-800">Animal Feed</span>
                <ArrowUpRight size={10} className="text-agri-green" />
              </div>
              <div className="bg-white/60 p-1.5 rounded-lg border border-white/40 flex justify-between items-center">
                <span className="text-[9px] font-bold text-gray-800">Food Proc.</span>
                <ArrowUpRight size={10} className="text-agri-green" />
              </div>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Tooltip Modal */}
      <AnimatePresence>
        {activeTooltip && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white p-6 rounded-[32px] shadow-2xl max-w-sm w-full relative">
              <button onClick={() => setActiveTooltip(null)} className="absolute top-4 right-4 text-gray-400"><X size={20}/></button>
              <div className="w-12 h-12 bg-agri-green/10 rounded-2xl flex items-center justify-center mb-4"><HelpCircle className="text-agri-green" /></div>
              <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-wide">Insight Guide</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{TOOLTIPS[activeTooltip][lang] || TOOLTIPS[activeTooltip]['en']}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Modal */}
      <AnimatePresence>
        {showModal && verifyResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
              <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-agri-green" size={20} />
                  <span className="font-bold text-gray-900">Verified Result</span>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-400"><X size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="text-center mb-8">
                  <div className="text-[10px] text-gray-400 tracking-widest mb-1 font-black uppercase">Authentication Hash</div>
                  <div className="text-2xl font-black tracking-wider text-gray-900">{verifyResult.hash}</div>
                </div>
                <div className="bg-[#f8faf7] rounded-[24px] p-5 space-y-4">
                   <div className="flex justify-between border-b border-gray-100 pb-3">
                     <span className="text-[10px] font-bold text-gray-400">GRADE</span>
                     <span className="text-xs font-black text-gray-900">{verifyResult.grade}</span>
                   </div>
                   <div className="flex justify-between border-b border-gray-100 pb-3">
                     <span className="text-[10px] font-bold text-gray-400">QUALITY SCORE</span>
                     <span className="text-xs font-black text-agri-green">{verifyResult.score}/100</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-[10px] font-bold text-gray-400">SHELF LIFE</span>
                     <span className="text-xs font-black text-blue-500">{verifyResult.shelfLife}</span>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
