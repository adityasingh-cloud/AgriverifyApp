import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CheckCircle, TrendingUp, ShieldCheck, Zap, Trash2, ArrowUpRight, HelpCircle, RefreshCw, Map, Wallet, AlertCircle } from 'lucide-react';
import { MOCK_INSIGHTS, TOOLTIPS } from '../mockData';

export function Dashboard() {
  const { user, scans } = useAuth();
  const { t, lang } = useLang();
  
  const [searchCode, setSearchCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

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
      setActiveModal('verification_success');
    }, 1200);
  };

  const BentoCard = ({ title, icon: Icon, children, modalId, className = "" }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => setActiveModal(modalId)}
      className={`relative bg-[#F1F8F4] border border-[#1E5128]/5 p-6 rounded-[28px] shadow-sm flex flex-col cursor-pointer hover:shadow-xl hover:shadow-[#1E5128]/5 transition-all ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3.5 bg-[#1E5128] rounded-[14px] shadow-lg shadow-[#1E5128]/20">
          <Icon size={22} color="white" />
        </div>
        <ArrowUpRight size={18} className="text-[#1E5128] opacity-20" />
      </div>
      <h3 className="text-[10px] font-black text-[#1E5128] uppercase tracking-[0.2em] mb-3">{title}</h3>
      <div className="flex-1">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-full bg-white p-6 pt-12 pb-32 font-body">
      {/* Premium Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-[#1E6F6B] animate-pulse" />
             <p className="text-[10px] text-[#2D2D2D] font-black uppercase tracking-[0.2em] opacity-40">{t(greetingKey)}</p>
          </div>
          <h1 className="text-3xl font-display font-black text-[#1E5128] tracking-tight">{user?.name || 'Farmer'}</h1>
        </div>
        <div className="w-16 h-16 rounded-[24px] bg-[#F1F8F4] border-2 border-white shadow-xl flex items-center justify-center text-4xl overflow-hidden">
          {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user?.gender === 'Female' ? '👩🏽‍🌾' : '👨🏽‍🌾')}
        </div>
      </div>

      {/* Structured Verification Hub */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E5128]/5 to-transparent rounded-[36px] -z-10" />
        <div className="bg-white border-2 border-[#F1F8F4] rounded-[36px] p-8 shadow-2xl shadow-gray-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F1F8F4] rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#1E6F6B]/10 flex items-center justify-center">
              <ShieldCheck size={20} className="text-[#1E6F6B]" />
            </div>
            <h2 className="text-[11px] font-black text-[#1E5128] uppercase tracking-[0.2em]">{t('verify_batch')}</h2>
          </div>
          
          <form onSubmit={handleVerify} className="relative mb-8 group">
            <div className="absolute inset-0 bg-[#1E6F6B]/5 rounded-[20px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex bg-white border-2 border-gray-50 rounded-[20px] p-1.5 focus-within:border-[#1E6F6B] transition-all">
              <input 
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))}
                placeholder={t('enter_hash')}
                className="flex-1 bg-transparent px-5 py-4 text-sm text-[#2D2D2D] font-bold outline-none placeholder:opacity-30"
              />
              <button 
                type="submit"
                disabled={searchCode.length !== 12 || isVerifying}
                className="bg-[#1E6F6B] text-white px-8 py-4 rounded-[16px] text-[11px] font-black shadow-lg shadow-[#1E6F6B]/20 disabled:opacity-30 active:scale-95 transition-all"
              >
                {isVerifying ? <RefreshCw className="animate-spin" size={16} /> : t('verify')}
              </button>
            </div>
          </form>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-50">
            {[
              { label: t('total_verified'), val: totalVerified, icon: CheckCircle },
              { label: t('avg_quality'), val: `${avgQuality}%`, icon: TrendingUp },
              { label: t('total_earned'), val: totalEarned, icon: Wallet }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-xl font-black text-[#1E5128] mb-1">{stat.val}</div>
                <div className="text-[8px] text-[#2D2D2D] uppercase font-black tracking-widest opacity-30 text-center leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Functional Bento Grid */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <BentoCard title="Market Index" icon={TrendingUp} modalId="market">
          <div className="flex flex-col">
            <div className="text-xl font-black text-[#1E5128] mb-1">{MOCK_INSIGHTS.marketIndex.currentPrice}</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#008C45]" />
              <span className="text-[9px] text-[#008C45] font-black uppercase tracking-widest">Bullish +4.2%</span>
            </div>
          </div>
        </BentoCard>

        <BentoCard title="Agri-Credit" icon={Zap} modalId="credit">
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 mb-2 flex items-center justify-center">
               <svg className="w-full h-full rotate-[-90deg]">
                 <circle cx="24" cy="24" r="20" fill="none" stroke="#1E5128" strokeWidth="4" strokeDasharray="125.6" strokeDashoffset="31.4" className="opacity-10" />
                 <circle cx="24" cy="24" r="20" fill="none" stroke="#1E6F6B" strokeWidth="4" strokeDasharray="125.6" strokeDashoffset="31.4" strokeLinecap="round" />
               </svg>
               <span className="absolute text-[10px] font-black text-[#1E5128]">91</span>
            </div>
            <span className="text-[9px] font-black text-[#1E5128] opacity-40 uppercase tracking-widest">Trust Score</span>
          </div>
        </BentoCard>

        <BentoCard title="Pest Radar" icon={Map} modalId="pest">
          <div className="h-16 bg-white/40 rounded-[16px] border border-[#1E5128]/5 flex flex-col items-center justify-center overflow-hidden">
             <div className="text-[10px] font-black text-[#1E5128] uppercase tracking-widest mb-1">0 Hazards</div>
             <div className="text-[8px] text-[#008C45] font-black uppercase tracking-widest">Zone: Safe</div>
          </div>
        </BentoCard>

        <BentoCard title="Value Recovery" icon={Trash2} modalId="recovery">
          <div className="flex flex-col h-full justify-between">
            <div className="text-[9px] text-[#1E5128] font-black opacity-40 mb-2">2 Listings Active</div>
            <div className="bg-[#1E5128] text-white p-2.5 rounded-[12px] flex justify-between items-center shadow-lg shadow-[#1E5128]/20">
              <span className="text-[8px] font-black uppercase tracking-widest">Process Now</span>
              <ArrowUpRight size={14} />
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Modals for Functionality */}
      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-6 bg-[#2D2D2D]/60 backdrop-blur-md">
            <motion.div 
              initial={{ y: 100, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 100, opacity: 0 }} 
              className="bg-white p-10 rounded-[40px] shadow-2xl max-w-sm w-full relative overflow-hidden"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-[#2D2D2D] opacity-20 hover:opacity-100 transition-opacity">
                <X size={28}/>
              </button>
              
              {activeModal === 'verification_success' && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#F1F8F4] rounded-[24px] flex items-center justify-center mb-6 mx-auto">
                    <ShieldCheck size={40} className="text-[#1E6F6B]" />
                  </div>
                  <h3 className="text-2xl font-display font-black text-[#1E5128] mb-2">Batch Verified</h3>
                  <p className="text-sm text-[#2D2D2D] opacity-60 mb-8 leading-relaxed">System Audit Complete. Batch LV-{searchCode.slice(-6)} is officially certified for Global Export.</p>
                  <button onClick={() => setActiveModal(null)} className="w-full bg-[#1E5128] text-white py-5 rounded-[20px] font-black uppercase tracking-widest">Done</button>
                </div>
              )}

              {activeModal === 'market' && (
                <div>
                  <h3 className="text-xl font-display font-black text-[#1E5128] mb-6 uppercase tracking-widest">Market Insights</h3>
                  <div className="space-y-4 mb-8">
                    {['Wheat: +₹200', 'Rice: Stable', 'Corn: -₹50'].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-[#F1F8F4] rounded-[16px]">
                        <span className="text-sm font-black text-[#1E5128]">{item.split(':')[0]}</span>
                        <span className="text-xs font-bold text-[#1E6F6B]">{item.split(':')[1]}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-[#1E6F6B] text-white py-4 rounded-[16px] font-black uppercase tracking-widest text-xs">View Full Mandi Report</button>
                </div>
              )}

              {activeModal === 'credit' && (
                <div className="text-center">
                  <h3 className="text-xl font-display font-black text-[#1E5128] mb-6 uppercase tracking-widest">Agri-Credit Hub</h3>
                  <div className="bg-[#F1F8F4] p-6 rounded-[24px] mb-8 text-left">
                     <div className="text-[10px] font-black text-[#1E5128] opacity-40 uppercase mb-2">Current Limit</div>
                     <div className="text-3xl font-black text-[#1E5128] mb-1">₹5,00,000</div>
                     <div className="text-xs text-[#008C45] font-bold">92% Approval Rating</div>
                  </div>
                  <button className="w-full bg-[#1E5128] text-white py-5 rounded-[20px] font-black uppercase tracking-widest">Apply for Loan</button>
                </div>
              )}

              {activeModal === 'pest' && (
                <div>
                  <h3 className="text-xl font-display font-black text-[#1E5128] mb-6 uppercase tracking-widest">Localized Hazards</h3>
                  <div className="bg-[#F1F8F4] rounded-[24px] h-40 mb-6 flex flex-col items-center justify-center p-6 text-center">
                     <AlertCircle size={32} className="text-[#008C45] mb-4" />
                     <div className="text-sm font-black text-[#1E5128]">No Outbreaks Detected</div>
                     <div className="text-[10px] text-[#2D2D2D] opacity-40 uppercase tracking-widest mt-2">Last Scan: 2 mins ago</div>
                  </div>
                  <button className="w-full bg-[#1E6F6B] text-white py-4 rounded-[16px] font-black uppercase tracking-widest text-xs">Report An Issue</button>
                </div>
              )}

              {activeModal === 'recovery' && (
                <div>
                  <h3 className="text-xl font-display font-black text-[#1E5128] mb-6 uppercase tracking-widest">Value Recovery</h3>
                  <p className="text-sm text-[#2D2D2D] opacity-60 mb-6">List your 'Ugly' or rejected produce for industrial biofuel or organic processing units.</p>
                  <div className="space-y-3 mb-8">
                     <div className="p-4 border-2 border-dashed border-[#1E5128]/10 rounded-[20px] flex items-center justify-center text-[10px] font-black text-[#1E5128] opacity-40">
                        + Add Rejected Batch
                     </div>
                  </div>
                  <button className="w-full bg-[#1E5128] text-white py-4 rounded-[16px] font-black uppercase tracking-widest text-xs">Browse Processing Units</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
