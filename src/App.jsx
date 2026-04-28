import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LangProvider } from './contexts/LangContext';
import { Auth } from './screens/Auth';
import { Layout } from './components/Layout';

function AppContent() {
  const { user, loading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  // Safety: if still loading after 8s, show recovery screen
  useEffect(() => {
    if (!loading) { setTimedOut(false); return; }
    const t = setTimeout(() => setTimedOut(true), 30000);
    return () => clearTimeout(t);
  }, [loading]);

  if (loading && !timedOut) {
    return (
      <div className="h-screen w-screen bg-agri-bg flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-agri-green border-t-transparent rounded-full animate-spin" />
        <p className="text-agri-green text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading AgriVerify...
        </p>
      </div>
    );
  }

  if (timedOut) {
    return (
      <div className="h-screen w-screen bg-agri-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-white mb-2">Connection Timeout</h2>
        <p className="text-gray-400 text-sm mb-8">Trouble connecting to servers. Tap below to retry.</p>
        <button
          onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.reload(); }}
          className="bg-agri-green text-black px-8 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  // user exists and has completed profile → Dashboard
  if (user && !user.isNew) return <Layout />;

  // no user or incomplete profile → Auth / Onboarding
  return <Auth />;
}

export default function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <AppContent />
      </LangProvider>
    </AuthProvider>
  );
}
