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
      className={`relative bg-white border-2 border-black/5 p-5 rounded-[24px] shadow-xl shadow-gray-200/20 flex flex-col ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-black rounded-[14px] shadow-lg shadow-black/10">
          <Icon size={20} className="text-white" />
        </div>
        <button onClick={() => setActiveTooltip(tooltipKey)} className="text-black opacity-30 hover:opacity-100 transition-opacity">
          <HelpCircle size={20} />
        </button>
      </div>
      <h3 className="text-[10px] font-black text-black uppercase tracking-[0.1em] mb-2">{title}</h3>
      <div className="flex-1">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-full bg-agri-bg p-5 pt-4 pb-24 font-body">
      {/* Alert Banner - Maximum Contrast */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="mb-8 bg-black p-4 rounded-[16px] flex items-center gap-4 shadow-2xl shadow-black/20"
      >
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
          <AlertCircle className="text-black" size={24} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">District Alert</p>
          <p className="text-sm font-black text-white">High Fungus Risk in Hooghly</p>
        </div>
        <ArrowUpRight size={20} className="text-white" />
      </motion.div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-[10px] text-black font-black uppercase tracking-[0.15em] mb-1 opacity-40">{t(greetingKey)} {greetingEmoji}</p>
          <h1 className="text-3xl font-display font-black text-black tracking-tight">{user?.name || 'Farmer'}</h1>
        </div>
        <div className="w-14 h-14 rounded-[18px] bg-black flex items-center justify-center text-3xl shadow-xl shadow-black/20 border-2 border-white/20">
          {user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}
        </div>
      </div>

      {/* Stats View - High Visibility */}
      <div className="bg-white border-2 border-black/5 rounded-[28px] p-7 shadow-2xl shadow-gray-200/30 mb-8">
        <h2 className="text-[11px] font-black text-black uppercase tracking-widest mb-5 opacity-40">{t('verify_batch')}</h2>
        
        <form onSubmit={handleVerify} className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black" size={22} />
          <input 
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))}
            placeholder={t('enter_hash')}
            className="w-full bg-gray-50 border-2 border-black/5 rounded-[14px] py-5 pl-14 pr-4 text-sm text-black font-black placeholder-gray-400 focus:border-black outline-none transition-colors"
          />
          <button 
            type="submit"
            disabled={searchCode.length !== 12 || isVerifying}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white px-6 py-3 rounded-[12px] text-[11px] font-black shadow-xl disabled:opacity-30 active:scale-95 transition-transform"
          >
            {isVerifying ? '...' : t('verify')}
          </button>
        </form>

        <div className="flex justify-between pt-6 border-t-2 border-gray-50">
          {[
            [t('total_verified'), totalVerified.toString()],
            [t('avg_quality'), `${avgQuality}%`],
            [t('total_earned'), totalEarned]
          ].map(([label, val], i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-black text-black">{val}</div>
              <div className="text-[9px] text-black uppercase font-black tracking-tighter opacity-40">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Bento Grid */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <BentoCard title="Market FairPlay" icon={TrendingUp} tooltipKey="fairplay">
          <div className="flex flex-col">
            <div className="text-lg font-black text-black mb-1">{MOCK_INSIGHTS.marketIndex.currentPrice}</div>
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-[6px] font-black uppercase tracking-widest">Grade {MOCK_INSIGHTS.marketIndex.qualityGrade}</span>
              <ShieldCheck size={14} className="text-black" />
            </div>
            <div className="text-[10px] text-black font-bold opacity-60">Value: {MOCK_INSIGHTS.marketIndex.fairPrice}</div>
          </div>
        </BentoCard>

        <BentoCard title="Agri-Credit" icon={CheckCircle} tooltipKey="credit">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 flex items-center justify-center mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * 0.87)} className="text-black" />
              </svg>
              <span className="absolute text-xs font-black text-black">{MOCK_INSIGHTS.creditScore}</span>
            </div>
            <button className="text-[9px] bg-black text-white px-3 py-2 rounded-[10px] font-black w-full uppercase tracking-widest shadow-lg shadow-black/20">Get Loan</button>
          </div>
        </BentoCard>

        <BentoCard title="Pest Radar" icon={AlertCircle} tooltipKey="pest">
          <div className="h-20 bg-gray-50 rounded-[14px] relative overflow-hidden flex items-center justify-center border-2 border-black/5">
             <div className="absolute w-6 h-6 bg-black/5 rounded-full animate-ping" />
             <div className="absolute w-2 h-2 bg-black rounded-full" />
             <div className="text-[9px] font-black text-black opacity-30 absolute bottom-2 uppercase tracking-widest">Radar Active</div>
          </div>
        </BentoCard>

        <BentoCard title="Value Recovery" icon={Trash2} tooltipKey="recovery">
          <div className="flex flex-col h-full justify-between">
            <div className="text-[10px] text-black font-black uppercase mb-3 opacity-40">Rejected Batch?</div>
            <div className="space-y-2">
              <div className="bg-black text-white p-2 rounded-[10px] flex justify-between items-center group cursor-pointer shadow-md">
                <span className="text-[10px] font-black uppercase">Sell Now</span>
                <ArrowUpRight size={12} />
              </div>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Tooltip Modal */}
      <AnimatePresence>
        {activeTooltip && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white p-8 rounded-[32px] shadow-2xl max-w-sm w-full relative border-2 border-black/5">
              <button onClick={() => setActiveTooltip(null)} className="absolute top-5 right-5 text-black opacity-30"><X size={24}/></button>
              <div className="w-14 h-14 bg-black rounded-[18px] flex items-center justify-center mb-5"><HelpCircle className="text-white" size={28} /></div>
              <h3 className="text-xl font-black text-black mb-3 uppercase tracking-widest">Guide</h3>
              <p className="text-sm text-black font-black leading-relaxed opacity-60">{TOOLTIPS[activeTooltip][lang] || TOOLTIPS[activeTooltip]['en']}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
