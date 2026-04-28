import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { Phone, Mail, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export function Auth() {
  const { loginWithGoogle, completeProfile, user, loading } = useAuth();
  const { t } = useLang();
  
  const [step, setStep] = useState(1); // 1: Method, 2: Phone, 3: OTP, 4: Profile
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', dob: '', city: '', state: '', country: 'India', phone: '', gender: 'Male'
  });

  useEffect(() => {
    if (user && user.isNew) {
      setStep(4);
    }
  }, [user]);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    setStep(3);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, phone: `+91 ${phone}` }));
      setStep(4);
      setIsVerifying(false);
    }, 1500);
  };

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

              <button onClick={() => setStep(2)} className="w-full flex items-center justify-center gap-3 bg-agri-card hover:bg-agri-card2 border border-agri-border py-4 rounded-2xl mb-4 transition-colors">
                <Phone size={20} className="text-agri-green" />
                <span className="font-semibold text-white">{t('login_phone')}</span>
              </button>

              <button onClick={loginWithGoogle} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 py-4 rounded-2xl transition-colors">
                <Mail size={20} className="text-black" />
                <span className="font-semibold text-black">{t('login_google')}</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-display font-black text-white mb-1">Enter Phone</h2>
              <p className="text-gray-400 text-sm mb-6">We'll send a 6-digit OTP for verification</p>

              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold border-r border-white/10 pr-3">+91</span>
                  <input 
                    required 
                    type="tel"
                    pattern="[0-9]{10}"
                    placeholder="10-digit number" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                    className="w-full bg-agri-card border border-agri-border rounded-xl pl-16 pr-4 py-4 text-white placeholder-gray-500 focus:border-agri-green outline-none transition-colors" 
                  />
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-agri-green to-agri-green-dim py-4 rounded-xl font-bold text-white shadow-[0_8px_24px_rgba(34,197,94,0.25)] flex justify-center items-center gap-2">
                  Send OTP <ArrowRight size={18} />
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-gray-500 text-xs py-2">Back to methods</button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-display font-black text-white mb-1">Verify OTP</h2>
              <p className="text-gray-400 text-sm mb-6">Enter code sent to +91 {phone}</p>

              <form onSubmit={handleOtpVerify} className="space-y-4">
                <input 
                  required 
                  type="text"
                  placeholder="000000" 
                  value={otp} 
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                  className="w-full bg-agri-card border border-agri-border rounded-xl px-4 py-4 text-center text-2xl tracking-[1em] text-white focus:border-agri-green outline-none" 
                />

                <button disabled={isVerifying} type="submit" className="w-full bg-gradient-to-r from-agri-green to-agri-green-dim py-4 rounded-xl font-bold text-white shadow-[0_8px_24px_rgba(34,197,94,0.25)] flex justify-center items-center gap-2 disabled:opacity-50">
                  {isVerifying ? <RefreshCw className="animate-spin" /> : <ShieldCheck size={18} />}
                  {isVerifying ? "Verifying..." : "Verify & Continue"}
                </button>
                <button type="button" onClick={() => setStep(2)} className="w-full text-gray-500 text-xs py-2">Resend OTP or change number</button>
              </form>
            </div>
          )}

          {step === 4 && (
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
