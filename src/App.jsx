import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LangProvider } from './contexts/LangContext';
import { Auth } from './screens/Auth';
import { Layout } from './components/Layout';

function AppContent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [timedOut, setTimedOut] = useState(false);

  // Watchdog: If checking profile takes > 2s, force onboarding or dashboard based on state
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      setTimedOut(true);
    }, 2000);
    return () => clearTimeout(t);
  }, [loading]);

  if (loading && !timedOut) {
    return (
      <div className="h-screen w-screen bg-agri-bg flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-agri-green border-t-transparent rounded-full animate-spin" />
        <p className="text-agri-green text-xs font-bold uppercase tracking-widest animate-pulse">
          Checking Compliance...
        </p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.isNew ? "/onboarding" : "/dashboard"} replace /> : <Auth />} />
      <Route path="/onboarding" element={user ? <Auth /> : <Navigate to="/" replace />} />
      <Route path="/dashboard" element={user && !user.isNew ? <Layout /> : <Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
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
