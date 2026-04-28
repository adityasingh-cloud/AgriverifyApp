import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CheckCircle, TrendingUp, ShieldCheck, AlertCircle, Trash2, ArrowUpRight, HelpCircle } from 'lucide-react';
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
      className={`relative bg-white border border-gray-100 p-5 rounded-[24px] shadow-lg shadow-gray-200/20 flex flex-col ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-50 rounded-[14px]">
          <Icon size={20} className="text-[#1A1A40]" />
        </div>
        <button onClick={() => setActiveTooltip(tooltipKey)} className="text-[#1A1A40] opacity-20 hover:opacity-100 transition-opacity">
          <HelpCircle size={20} />
        </button>
      </div>
      <h3 className="text-[10px] font-black text-[#1A1A40] uppercase tracking-[0.1em] mb-2">{title}</h3>
      <div className="flex-1">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-full bg-white p-5 pt-4 pb-24 font-body">
      {/* Alert Banner - Hyper Coral */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="mb-8 bg-[#FF6F61] p-4 rounded-[16px] flex items-center gap-4 shadow-xl shadow-[#FF6F61]/20"
      >
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
          <AlertCircle className="text-[#FF6F61]" size={24} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">District Alert</p>
          <p className="text-sm font-black text-white">High Fungus Risk detected in Hooghly</p>
        </div>
        <ArrowUpRight size={20} className="text-white" />
      </motion.div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-[10px] text-[#1A1A40] font-black uppercase tracking-[0.15em] mb-1 opacity-40">{t(greetingKey)} {greetingEmoji}</p>
          <h1 className="text-3xl font-display font-black text-[#1A1A40] tracking-tight">{user?.name || 'Farmer'}</h1>
        </div>
        <div className="w-14 h-14 rounded-[18px] bg-[#0056B3] flex items-center justify-center text-3xl shadow-xl shadow-[#0056B3]/20">
          {user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}
        </div>
      </div>

      {/* Scanner Quick Access */}
      <div className="bg-white border-2 border-gray-50 rounded-[28px] p-7 shadow-2xl shadow-gray-200/30 mb-10">
        <h2 className="text-[11px] font-black text-[#1A1A40] uppercase tracking-widest mb-6 opacity-40">{t('verify_batch')}</h2>
        
        <form onSubmit={handleVerify} className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
          <input 
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))}
            placeholder={t('enter_hash')}
            className="w-full bg-gray-50 border-none rounded-[16px] py-5 pl-14 pr-4 text-sm text-[#1A1A40] font-bold placeholder-gray-300 focus:ring-2 focus:ring-[#0056B3]/10 outline-none"
          />
          <button 
            type="submit"
            disabled={searchCode.length !== 12 || isVerifying}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0056B3] text-white px-6 py-3 rounded-[12px] text-[11px] font-black shadow-xl disabled:opacity-30"
          >
            {isVerifying ? '...' : t('verify')}
          </button>
        </form>

        <div className="flex justify-between pt-6 border-t border-gray-50">
          {[
            [t('total_verified'), totalVerified.toString(), "text-[#008C45]"],
            [t('avg_quality'), `${avgQuality}%`, "text-[#0056B3]"],
            [t('total_earned'), totalEarned, "text-[#1A1A40]"]
          ].map(([label, val, color], i) => (
            <div key={i} className="text-center">
              <div className={`text-xl font-black ${color}`}>{val}</div>
              <div className="text-[9px] text-[#1A1A40] uppercase font-black tracking-tighter opacity-40">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hackathon Bento Grid */}
      <div className="grid grid-cols-2 gap-5 mb-10">
        {/* Card 1: Market FairPlay - Electric Forest */}
        <BentoCard title="Market FairPlay" icon={TrendingUp} tooltipKey="fairplay">
          <div className="flex flex-col">
            <div className="text-lg font-black text-[#1A1A40] mb-1">{MOCK_INSIGHTS.marketIndex.currentPrice}</div>
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-[10px] bg-[#008C45] text-white px-2 py-0.5 rounded-[6px] font-black uppercase tracking-widest">Verified A+</span>
              <ShieldCheck size={14} className="text-[#008C45]" />
            </div>
            <div className="text-[10px] text-[#1A1A40] font-bold opacity-60 leading-tight">Fair value: {MOCK_INSIGHTS.marketIndex.fairPrice}</div>
          </div>
        </BentoCard>

        {/* Card 2: Agri-Credit Score - Circular Gauge */}
        <BentoCard title="Agri-Credit" icon={CheckCircle} tooltipKey="credit">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 flex items-center justify-center mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * 0.92)} className="text-[#28A745]" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[11px] font-black text-[#1A1A40]">{MOCK_INSIGHTS.creditScore}</span>
              </div>
            </div>
            <button className="text-[9px] bg-[#1A1A40] text-white px-3 py-2 rounded-[10px] font-black w-full uppercase tracking-widest shadow-lg">Apply for Loan</button>
          </div>
        </BentoCard>

        {/* Card 3: Pest Radar - Mini Map */}
        <BentoCard title="Pest Radar" icon={AlertCircle} tooltipKey="pest">
          <div className="h-20 bg-gray-50 rounded-[16px] relative overflow-hidden flex items-center justify-center border border-gray-100">
             <div className="absolute w-6 h-6 bg-[#FF6F61]/20 rounded-full animate-ping" />
             <div className="absolute w-2 h-2 bg-[#FF6F61] rounded-full shadow-[0_0_10px_rgba(255,111,97,0.5)]" />
             <div className="text-[9px] font-black text-[#FF6F61] absolute bottom-2 uppercase tracking-widest">High Risk Area</div>
          </div>
        </BentoCard>

        {/* Card 4: Value Recovery - Rejected Produce */}
        <BentoCard title="Value Recovery" icon={Trash2} tooltipKey="recovery">
          <div className="flex flex-col h-full justify-between">
            <div className="text-[10px] text-[#1A1A40] font-black leading-tight mb-3 opacity-40">Have rejected crops?</div>
            <div className="space-y-2">
              <div className="bg-[#1A1A40]/5 p-2 rounded-[10px] flex justify-between items-center group cursor-pointer hover:bg-[#1A1A40]/10 transition-colors">
                <span className="text-[10px] font-black text-[#1A1A40] uppercase">Processing</span>
                <ArrowUpRight size={12} className="text-[#008C45]" />
              </div>
              <div className="bg-[#1A1A40]/5 p-2 rounded-[10px] flex justify-between items-center group cursor-pointer hover:bg-[#1A1A40]/10 transition-colors">
                <span className="text-[10px] font-black text-[#1A1A40] uppercase">Animal Feed</span>
                <ArrowUpRight size={12} className="text-[#008C45]" />
              </div>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Tooltip Modal */}
      <AnimatePresence>
        {activeTooltip && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1A1A40]/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white p-8 rounded-[32px] shadow-2xl max-w-sm w-full relative border border-gray-100">
              <button onClick={() => setActiveTooltip(null)} className="absolute top-5 right-5 text-[#1A1A40] opacity-30"><X size={24}/></button>
              <div className="w-14 h-14 bg-gray-50 rounded-[18px] flex items-center justify-center mb-6"><HelpCircle className="text-[#0056B3]" size={28} /></div>
              <h3 className="text-xl font-black text-[#1A1A40] mb-3 uppercase tracking-widest">Scientific Insight</h3>
              <p className="text-sm text-[#1A1A40] leading-relaxed font-medium opacity-60">{TOOLTIPS[activeTooltip][lang] || TOOLTIPS[activeTooltip]['en']}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
