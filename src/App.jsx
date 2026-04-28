import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
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
          <p className="text-agri-green font-bold animate-pulse text-xs uppercase tracking-widest leading-loose">Checking Compliance Session...</p>
        </div>
      </div>
    );
  }
  
  // Logic: 
  // 1. If no user (from Auth0) -> Show Login screen
  // 2. If user exists but isNew (no Firestore doc) -> Show Onboarding screen
  // 3. If user exists and NOT isNew -> Show Main Dashboard
  if (!user || user.isNew) {
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
