import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LangProvider } from './contexts/LangContext';
import { Auth } from './screens/Auth';
import { Layout } from './components/Layout';

function AppContent() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-screen bg-agri-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-agri-green border-t-transparent rounded-full animate-spin"></div>
          <p className="text-agri-green font-bold animate-pulse text-xs uppercase tracking-widest">Loading AgriVerify...</p>
        </div>
      </div>
    );
  }
  
  // Logic: 
  // 1. If no user -> Auth screen (Login)
  // 2. If user exists but isNew -> Auth screen (will show Onboarding step)
  // 3. If user exists and NOT isNew -> Layout (Dashboard)
  if (!user || user.isNew) {
    return <Auth />;
  }

  return <Layout />;
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
