import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { Phone, Mail, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export function Auth() {
  const { loginWithGoogle, loginWithPhone, completeProfile, user, loading } = useAuth();
  const { t } = useLang();

  // step: 1 = choose method, 2 = phone entry, 3 = OTP, 4 = profile form
  const [step, setStep]   = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp]     = useState('');
  const [otpSent, setOtpSent]   = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [form, setForm] = useState({
    name: '', dob: '', city: '', state: '', country: 'India', phone: '', gender: 'Male',
  });

  // When user comes back authenticated but without a profile, jump to step 4
  useEffect(() => {
    if (user && user.isNew) setStep(4);
  }, [user]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length !== 10) { alert('Enter a valid 10-digit number'); return; }
    setOtpSent(true);
    setStep(3);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) { alert('Enter the OTP'); return; }
    setVerifying(true);
    try {
      // Create a real Firebase anonymous session so the profile form has a uid
      await loginWithPhone();
      setForm(p => ({ ...p, phone: `+91 ${phone}` }));
      setStep(4);
    } catch {
      // loginWithPhone already alerts the user
    } finally {
      setVerifying(false);
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    await completeProfile(form);
  };

  return (
    <div className="h-screen w-screen bg-agri-bg flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-agri-green/10 to-transparent pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-agri-green/20 blur-[80px]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          className="w-full max-w-sm z-10"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-agri-green/30 to-agri-green/5 border border-agri-green/30 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(34,197,94,0.15)]">
              🌾
            </div>
          </div>

          {/* ── Step 1: Choose method ── */}
          {step === 1 && (
            <div className="text-center">
              <h1 className="text-3xl font-display font-black text-white mb-2">AgriVerify AI</h1>
              <p className="text-gray-400 text-sm mb-10">Secure Crop Verification Platform</p>

              <button
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-3 bg-agri-card hover:bg-agri-card2 border border-agri-border py-4 rounded-2xl mb-4 transition-colors"
              >
                <Phone size={20} className="text-agri-green" />
                <span className="font-semibold text-white">{t('login_phone') || 'Continue with Phone'}</span>
              </button>

              <button
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 py-4 rounded-2xl transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-semibold text-black">{t('login_google') || 'Continue with Google'}</span>
              </button>
            </div>
          )}

          {/* ── Step 2: Phone number ── */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-display font-black text-white mb-1">Enter Phone</h2>
              <p className="text-gray-400 text-sm mb-6">We'll send a 6-digit OTP</p>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold border-r border-white/10 pr-3">+91</span>
                  <input
                    required
                    type="tel"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full bg-agri-card border border-agri-border rounded-xl pl-16 pr-4 py-4 text-white placeholder-gray-500 focus:border-agri-green outline-none"
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-agri-green to-agri-green-dim py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2 shadow-[0_8px_24px_rgba(34,197,94,0.25)]">
                  Send OTP <ArrowRight size={18} />
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-gray-500 text-xs py-2">← Back</button>
              </form>
            </div>
          )}

          {/* ── Step 3: OTP verify ── */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-display font-black text-white mb-1">Enter OTP</h2>
              <p className="text-gray-400 text-sm mb-6">Sent to +91 {phone}</p>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="••••••"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-agri-card border border-agri-border rounded-xl px-4 py-4 text-center text-2xl tracking-[0.8em] text-white focus:border-agri-green outline-none"
                />
                <button disabled={verifying} type="submit" className="w-full bg-gradient-to-r from-agri-green to-agri-green-dim py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2 disabled:opacity-60">
                  {verifying ? <RefreshCw size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                  {verifying ? 'Verifying…' : 'Verify & Continue'}
                </button>
                <button type="button" onClick={() => setStep(2)} className="w-full text-gray-500 text-xs py-2">← Resend / Change number</button>
              </form>
            </div>
          )}

          {/* ── Step 4: Profile form ── */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-display font-black text-white mb-1">{t('complete_profile') || 'Complete Profile'}</h2>
              <p className="text-gray-400 text-sm mb-6">Almost there – tell us about yourself</p>
              <form onSubmit={handleComplete} className="space-y-4">
                <input
                  required placeholder="Full Name"
                  value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-agri-green outline-none"
                />
                <div className="flex gap-3">
                  <input
                    type="date" required
                    value={form.dob} onChange={e => setForm(p => ({ ...p, dob: e.target.value }))}
                    className="flex-1 bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white focus:border-agri-green outline-none"
                  />
                  <select
                    value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                    className="flex-1 bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white focus:border-agri-green outline-none"
                  >
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <input
                    required placeholder="City"
                    value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                    className="flex-1 bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-agri-green outline-none"
                  />
                  <input
                    required placeholder="State"
                    value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                    className="flex-1 bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-agri-green outline-none"
                  />
                </div>
                <input
                  required placeholder="Phone Number"
                  value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-agri-card border border-agri-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-agri-green outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-agri-green to-agri-green-dim py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2 shadow-[0_8px_24px_rgba(34,197,94,0.25)] disabled:opacity-60 transition-transform hover:scale-[0.98]"
                >
                  {loading
                    ? <RefreshCw size={18} className="animate-spin" />
                    : <>{t('start_using') || 'Start Using AgriVerify'} <ArrowRight size={18} /></>
                  }
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
