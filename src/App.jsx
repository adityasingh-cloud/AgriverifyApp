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
    // Clear old session data if definitely not logged in to prevent stale state issues
    if (!loading && !user) {
      sessionStorage.clear();
      console.log("Stale session cleared.");
    }

    const timer = setTimeout(() => {
      if (loading) {
        console.warn("Auth check taking too long (3s), triggering safety timeout.");
        setSafetyTimeout(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [loading, user]);
  
  if (loading && !safetyTimeout) {
    return (
      <div className="h-screen w-screen bg-agri-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-agri-green border-t-transparent rounded-full animate-spin"></div>
          <p className="text-agri-green font-bold animate-pulse text-xs uppercase tracking-widest leading-loose text-center">
            {t('loading_compliance') || 'Checking Compliance Session...'}
          </p>
        </div>
      </div>
    );
  }
  
  if (safetyTimeout) {
    console.error("Safety timeout reached. Rendering recovery UI.");
    return (
      <div className="h-screen w-screen bg-agri-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-white mb-2">Connection Timeout</h2>
        <p className="text-gray-400 text-sm mb-8">We are having trouble syncing your session. Please try again.</p>
        <button 
          onClick={() => {
            sessionStorage.clear();
            localStorage.clear();
            window.location.replace('/');
          }}
          className="bg-agri-green text-black px-8 py-3 rounded-xl font-bold shadow-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Final Routing Logic
  if (!user || user.isNew) {
    console.log("Routing to Auth screen.");
    return <Auth />;
  }

  console.log("Routing to Main Dashboard.");
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
