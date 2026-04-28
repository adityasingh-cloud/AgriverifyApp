import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LangProvider } from './contexts/LangContext';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <Layout />
      </LangProvider>
    </AuthProvider>
  );
}
