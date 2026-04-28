import React, { useState, useEffect } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LangProvider } from './contexts/LangContext';
import { Auth } from './screens/Auth';
import { Layout } from './components/Layout';

function AppContent() {
  const { user, loading } = useAuth();
  const [safetyTimeout, setSafetyTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("Auth check taking too long, triggering safety timeout.");
        setSafetyTimeout(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [loading]);
  
  if (loading && !safetyTimeout) {
    return (
      <div className="h-screen w-screen bg-agri-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-agri-green border-t-transparent rounded-full animate-spin"></div>
          <p className="text-agri-green font-bold animate-pulse text-xs uppercase tracking-widest leading-loose">Checking Compliance Session...</p>
        </div>
      </div>
    );
  }
  
  // Logic Fix: 
  // 1. If no user OR user isNew -> Auth screen (Login/Onboarding)
  // 2. If user exists and NOT isNew -> Layout (Dashboard)
  // Safety timeout also falls through to Auth screen
  if (!user || user.isNew || safetyTimeout) {
    return <Auth />;
  }

  return <Layout />;
}

export default function App() {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || "agriverify.jp.auth0.com";
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "4xBI1XnQAjvmhOJ2eoARRgthg1O6GDUD";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      cacheLocation="localstorage"
    >
      <AuthProvider>
        <LangProvider>
          <AppContent />
        </LangProvider>
      </AuthProvider>
    </Auth0Provider>
  );
}
