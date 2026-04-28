import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CheckCircle, TrendingUp, ShieldCheck, Zap, Trash2, ArrowUpRight, HelpCircle } from 'lucide-react';
import { MOCK_INSIGHTS, TOOLTIPS } from '../mockData';

export function Dashboard() {
  const { user, scans } = useAuth();
  const { t, lang } = useLang();
  
  const [searchCode, setSearchCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const hour = new Date().getHours();
  let greetingKey = 'good_morning';
  if (hour >= 12 && hour < 17) greetingKey = 'good_afternoon';
  else if (hour >= 17 || hour < 4) greetingKey = 'good_night';

  const totalVerified = scans.length;
  const avgQuality = scans.length > 0 ? Math.round(scans.reduce((acc, curr) => acc + curr.score, 0) / scans.length) : 0;
  const totalEarned = `₹${(scans.length * 1500).toLocaleString()}`;

  const handleVerify = (e) => {
    e.preventDefault();
    if (searchCode.length !== 12) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      alert("Verification Audit Log: Success. Certified Grade A.");
    }, 1200);
  };

  const BentoCard = ({ title, icon: Icon, children, tooltipKey, className = "" }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`relative bg-[#F1F8F4] border border-[#1E5128]/5 p-5 rounded-[24px] shadow-sm flex flex-col ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#1E5128]/10 rounded-[14px]">
          <Icon size={20} className="text-[#1E5128]" />
        </div>
        <button onClick={() => setActiveTooltip(tooltipKey)} className="text-[#1E5128] opacity-20 hover:opacity-100 transition-opacity">
          <HelpCircle size={20} />
        </button>
      </div>
      <h3 className="text-[10px] font-black text-[#1E5128] uppercase tracking-[0.2em] mb-2">{title}</h3>
      <div className="flex-1">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-full bg-white p-6 pt-12 pb-32 font-body">
      {/* Header - Minimalist */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <p className="text-[10px] text-[#2D2D2D] font-black uppercase tracking-[0.2em] mb-1 opacity-40">{t(greetingKey)}</p>
          <h1 className="text-3xl font-display font-black text-[#1E5128] tracking-tight">{user?.name || 'Farmer'}</h1>
        </div>
        <div className="w-14 h-14 rounded-[20px] bg-[#1E5128] flex items-center justify-center text-3xl shadow-lg shadow-[#1E5128]/20">
          {user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾'}
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="bg-[#F1F8F4] border border-[#1E5128]/5 rounded-[32px] p-8 shadow-sm mb-12">
        <h2 className="text-[11px] font-black text-[#1E5128] uppercase tracking-[0.2em] mb-6 opacity-60">{t('verify_batch')}</h2>
        
        <form onSubmit={handleVerify} className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1E5128]/30" size={24} />
          <input 
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))}
            placeholder={t('enter_hash')}
            className="w-full bg-white border border-[#1E5128]/10 rounded-[20px] py-5 pl-14 pr-4 text-sm text-[#2D2D2D] font-bold focus:ring-2 focus:ring-[#1E6F6B]/20 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={searchCode.length !== 12 || isVerifying}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1E6F6B] text-white px-6 py-3 rounded-[16px] text-[11px] font-black shadow-lg disabled:opacity-30"
          >
            {isVerifying ? '...' : t('verify')}
          </button>
        </form>

        <div className="flex justify-between pt-8 border-t border-[#1E5128]/10">
          {[
            [t('total_verified'), totalVerified.toString()],
            [t('avg_quality'), `${avgQuality}%`],
            [t('total_earned'), totalEarned]
          ].map(([label, val], i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-black text-[#1E5128]">{val}</div>
              <div className="text-[9px] text-[#2D2D2D] uppercase font-black tracking-widest opacity-40">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Uniform Bento Grid */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <BentoCard title="Market Index" icon={TrendingUp} tooltipKey="fairplay">
          <div className="flex flex-col">
            <div className="text-lg font-black text-[#1E5128] mb-1">{MOCK_INSIGHTS.marketIndex.currentPrice}</div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-[#1E5128] text-white px-2 py-0.5 rounded-[6px] font-black uppercase tracking-widest">Grade A+</span>
              <ShieldCheck size={14} className="text-[#1E5128]" />
            </div>
          </div>
        </BentoCard>

        <BentoCard title="Agri-Credit" icon={Zap} tooltipKey="credit">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-black text-[#1E5128] mb-1">{MOCK_INSIGHTS.creditScore}</div>
            <div className="text-[9px] font-black text-[#1E5128] opacity-40 uppercase tracking-widest mb-3">Trust Score</div>
            <button className="text-[9px] bg-[#1E6F6B] text-white px-4 py-2 rounded-[10px] font-black w-full uppercase tracking-widest shadow-md">Apply</button>
          </div>
        </BentoCard>

        <BentoCard title="Pest Radar" icon={CheckCircle} tooltipKey="pest">
          <div className="h-16 bg-white/50 rounded-[16px] relative overflow-hidden flex items-center justify-center border border-[#1E5128]/5">
             <div className="text-[10px] font-black text-[#1E5128] uppercase tracking-widest">Low Risk</div>
          </div>
        </BentoCard>

        <BentoCard title="Recovery" icon={Trash2} tooltipKey="recovery">
          <div className="flex flex-col h-full justify-between">
            <div className="text-[10px] text-[#1E5128] font-black opacity-40 mb-3">Rejected Crops</div>
            <div className="bg-[#1E6F6B] text-white p-2 rounded-[10px] flex justify-between items-center group cursor-pointer shadow-sm">
              <span className="text-[9px] font-black uppercase">Sell Now</span>
              <ArrowUpRight size={12} />
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Tooltip Modal */}
      <AnimatePresence>
        {activeTooltip && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#2D2D2D]/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white p-8 rounded-[32px] shadow-2xl max-w-sm w-full relative">
              <button onClick={() => setActiveTooltip(null)} className="absolute top-5 right-5 text-[#2D2D2D] opacity-20"><X size={24}/></button>
              <div className="w-14 h-14 bg-[#F1F8F4] rounded-[18px] flex items-center justify-center mb-6"><TrendingUp className="text-[#1E5128]" size={28} /></div>
              <h3 className="text-xl font-black text-[#1E5128] mb-3 uppercase tracking-widest">Tech Insights</h3>
              <p className="text-sm text-[#2D2D2D] leading-relaxed font-medium opacity-60">{TOOLTIPS[activeTooltip][lang] || TOOLTIPS[activeTooltip]['en']}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
