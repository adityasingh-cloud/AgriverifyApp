import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { Mail, ArrowRight, LogIn, RefreshCw } from 'lucide-react';

export function Auth() {
  const { login, completeProfile, user, loading } = useAuth();
  const { t } = useLang();
  
  const [step, setStep] = useState(1); // 1: Login Trigger, 2: Profile Onboarding
  const [formData, setFormData] = useState({
    name: '', dob: '', city: '', state: '', country: 'India', phone: '', gender: 'Male'
  });

  useEffect(() => {
    if (user && user.isNew) {
      setStep(2);
    }
  }, [user]);

  const handleComplete = (e) => {
    e.preventDefault();
    completeProfile(formData);
  };

  return (
    <div className="h-screen w-screen bg-agri-bg flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-agri-green/10 to-transparent pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-agri-green/20 blur-[80px]" />

      <AnimatePresence mode="wait">
        <motion.div 
          key={step} 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-sm z-10"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-agri-green/30 to-agri-green/5 border border-agri-green/30 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(34,197,94,0.15)]">🌾</div>
          </div>

          {step === 1 && (
            <div className="text-center">
              <h1 className="text-3xl font-display font-black text-white mb-2">AgriVerify AI</h1>
              <p className="text-gray-400 text-sm mb-10">Secure Verification & Social Hub</p>

              <button 
                onClick={login} 
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-agri-green to-agri-green-dim py-5 rounded-2xl transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(34,197,94,0.3)]"
              >
                <LogIn size={22} className="text-white" />
                <span className="font-bold text-lg text-white">Continue to Login</span>
              </button>
              
              <p className="mt-8 text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                Powered by Auth0 & Learvon Compliance Engine
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-display font-black text-white mb-1">{t('complete_profile')}</h2>
              <p className="text-gray-400 text-sm mb-6">Complete your profile to join the community</p>

              <form onSubmit={handleComplete} className="space-y-4">
                <input required placeholder="Full Name" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="w-full bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-agri-green outline-none transition-colors" />
                
                <div className="flex gap-4">
                  <input type="date" required value={formData.dob} onChange={e => setFormData(p => ({...p, dob: e.target.value}))} className="flex-1 bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white focus:border-agri-green outline-none" />
                  <select value={formData.gender} onChange={e => setFormData(p => ({...p, gender: e.target.value}))} className="flex-1 bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white focus:border-agri-green outline-none appearance-none">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <input required placeholder="City" value={formData.city} onChange={e => setFormData(p => ({...p, city: e.target.value}))} className="flex-1 bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-agri-green outline-none" />
                  <input required placeholder="State" value={formData.state} onChange={e => setFormData(p => ({...p, state: e.target.value}))} className="flex-1 bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-agri-green outline-none" />
                </div>

                <input required placeholder="Phone Number" value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} className="w-full bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-agri-green outline-none" />

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-agri-green to-agri-green-dim py-4 rounded-xl font-bold text-white shadow-[0_8px_24px_rgba(34,197,94,0.25)] flex justify-center items-center gap-2 hover:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <>
                      {t('start_using')} <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
