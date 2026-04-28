import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LangProvider } from './contexts/LangContext';
import { Auth } from './screens/Auth';
import { Layout } from './components/Layout';

function AppContent() {
  const { user } = useAuth();
  return user ? <Layout /> : <Auth />;
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
