import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './screens/Dashboard';
import { Community } from './screens/Community';
import { News } from './screens/News';
import { Profile } from './screens/Profile';
import { Support } from './screens/Support';
import { CameraOverlay } from './components/CameraOverlay';
import { AuthProvider } from './contexts/AuthContext';
import { LangProvider } from './contexts/LangContext';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showCamera, setShowCamera] = useState(false);

  const renderScreen = () => {
    switch(currentTab) {
      case 'dashboard': return <Dashboard />;
      case 'community': return <Community />;
      case 'news': return <News />;
      case 'profile': return <Profile setCurrentTab={setCurrentTab} />;
      case 'support': return <Support setCurrentTab={setCurrentTab} />;
      default: return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <LangProvider>
        <div className="relative h-full w-full max-w-md mx-auto overflow-hidden">
          <Layout currentTab={currentTab} setCurrentTab={setCurrentTab} onCameraClick={() => setShowCamera(true)}>
            {renderScreen()}
          </Layout>
          
          {showCamera && (
            <CameraOverlay onClose={() => setShowCamera(false)} />
          )}
        </div>
      </LangProvider>
    </AuthProvider>
  );
}

export default App;
