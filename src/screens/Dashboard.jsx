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
      className={`relative bg-white border border-gray-100 p-5 rounded-[24px] shadow-sm flex flex-col ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2.5 bg-agri-emerald/5 rounded-2xl">
          <Icon size={20} className="text-agri-emerald" />
        </div>
        <button onClick={() => setActiveTooltip(tooltipKey)} className="text-agri-clay/40 hover:text-agri-emerald transition-colors">
          <HelpCircle size={18} />
        </button>
      </div>
      <h3 className="text-[10px] font-black text-agri-clay uppercase tracking-widest mb-2">{title}</h3>
      <div className="flex-1">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-full bg-white p-5 pt-4 pb-24 font-body">
      {/* Alert Banner - Nature Tech Coral */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="mb-6 bg-agri-coral/5 border border-agri-coral/20 p-4 rounded-[12px] flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-agri-coral/10 rounded-full flex items-center justify-center shrink-0">
          <AlertCircle className="text-agri-coral" size={20} />
        </div>
        <div className="flex-1">
          <p className="text-[9px] font-black text-agri-coral uppercase tracking-tighter">District Alert</p>
          <p className="text-xs font-bold text-agri-emerald">High Fungus Risk detected in Hooghly</p>
        </div>
        <ArrowUpRight size={16} className="text-agri-coral/40" />
      </motion.div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-[10px] text-agri-clay font-black uppercase tracking-widest mb-1">{t(greetingKey)} {greetingEmoji}</p>
          <h1 className="text-2xl font-display font-black text-agri-emerald">{user?.name || 'Farmer'}</h1>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-agri-emerald flex items-center justify-center text-2xl shadow-lg shadow-agri-emerald/20">
          {user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}
        </div>
      </div>

      {/* Stats Quick View - Minimal Scientific */}
      <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-xl shadow-gray-200/20 mb-8">
        <h2 className="text-[10px] font-black text-agri-clay uppercase tracking-widest mb-4">{t('verify_batch')}</h2>
        
        <form onSubmit={handleVerify} className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-agri-clay/40" size={20} />
          <input 
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))}
            placeholder={t('enter_hash')}
            className="w-full bg-gray-50 border-none rounded-[12px] py-4 pl-12 pr-4 text-sm text-agri-emerald font-bold placeholder-gray-300 focus:ring-2 focus:ring-agri-teal/10 outline-none"
          />
          <button 
            type="submit"
            disabled={searchCode.length !== 12 || isVerifying}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-agri-emerald text-white px-5 py-2 rounded-[10px] text-[10px] font-black shadow-lg shadow-agri-emerald/20 disabled:opacity-30"
          >
            {isVerifying ? '...' : t('verify')}
          </button>
        </form>

        <div className="flex justify-between pt-4 border-t border-gray-50">
          {[
            [t('total_verified'), totalVerified.toString(), "text-agri-emerald"],
            [t('avg_quality'), `${avgQuality}%`, "text-agri-teal"],
            [t('total_earned'), totalEarned, "text-agri-clay"]
          ].map(([label, val, color], i) => (
            <div key={i} className="text-center">
              <div className={`text-lg font-black ${color}`}>{val}</div>
              <div className="text-[9px] text-agri-clay/60 uppercase font-black tracking-tighter">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Bento Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Card 1: Market FairPlay */}
        <BentoCard title="Market FairPlay" icon={TrendingUp} tooltipKey="fairplay">
          <div className="flex flex-col">
            <div className="text-sm font-black text-agri-emerald mb-1">{MOCK_INSIGHTS.marketIndex.currentPrice}</div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[10px] bg-agri-butter text-agri-emerald px-1.5 py-0.5 rounded-[6px] font-black">Grade {MOCK_INSIGHTS.marketIndex.qualityGrade}</span>
              <ShieldCheck size={12} className="text-agri-teal" />
            </div>
            <div className="text-[9px] text-agri-clay font-bold leading-tight">Index: {MOCK_INSIGHTS.marketIndex.fairPrice}</div>
          </div>
        </BentoCard>

        {/* Card 2: Agri-Credit Score */}
        <BentoCard title="Agri-Credit" icon={CheckCircle} tooltipKey="credit">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 flex items-center justify-center mb-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-50" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * 0.87)} className="text-agri-teal" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] font-black text-agri-emerald">{MOCK_INSIGHTS.creditScore}</span>
              </div>
            </div>
            <button className="text-[8px] bg-agri-emerald text-white px-2 py-1.5 rounded-[8px] font-black w-full uppercase tracking-widest shadow-md shadow-agri-emerald/10">Apply for Loan</button>
          </div>
        </BentoCard>

        {/* Card 3: Pest Radar */}
        <BentoCard title="Pest Radar" icon={AlertCircle} tooltipKey="pest">
          <div className="h-20 bg-gray-50 rounded-[12px] relative overflow-hidden flex items-center justify-center border border-gray-100">
             <div className="absolute w-4 h-4 bg-agri-coral/20 rounded-full animate-ping" />
             <div className="absolute w-2 h-2 bg-agri-coral rounded-full" />
             <div className="text-[8px] font-black text-agri-clay/40 absolute bottom-2 uppercase">Scanning District</div>
          </div>
        </BentoCard>

        {/* Card 4: Value Recovery */}
        <BentoCard title="Value Recovery" icon={Trash2} tooltipKey="recovery">
          <div className="flex flex-col h-full justify-between">
            <div className="text-[10px] text-agri-clay font-bold mb-2">Rejected Batch?</div>
            <div className="space-y-1.5">
              <div className="bg-agri-teal/5 p-1.5 rounded-[8px] flex justify-between items-center group cursor-pointer hover:bg-agri-teal/10 transition-colors">
                <span className="text-[9px] font-black text-agri-teal uppercase">Animal Feed</span>
                <ArrowUpRight size={10} className="text-agri-teal" />
              </div>
              <div className="bg-agri-coral/5 p-1.5 rounded-[8px] flex justify-between items-center group cursor-pointer hover:bg-agri-coral/10 transition-colors">
                <span className="text-[9px] font-black text-agri-coral uppercase">Processing</span>
                <ArrowUpRight size={10} className="text-agri-coral" />
              </div>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Tooltip Modal */}
      <AnimatePresence>
        {activeTooltip && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-agri-emerald/20 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white p-6 rounded-[24px] shadow-2xl max-w-sm w-full relative border border-gray-100">
              <button onClick={() => setActiveTooltip(null)} className="absolute top-4 right-4 text-agri-clay/40"><X size={20}/></button>
              <div className="w-12 h-12 bg-agri-butter rounded-2xl flex items-center justify-center mb-4"><HelpCircle className="text-agri-emerald" /></div>
              <h3 className="text-sm font-black text-agri-emerald mb-2 uppercase tracking-widest">Scientific Guide</h3>
              <p className="text-xs text-agri-clay font-bold leading-relaxed">{TOOLTIPS[activeTooltip][lang] || TOOLTIPS[activeTooltip]['en']}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
