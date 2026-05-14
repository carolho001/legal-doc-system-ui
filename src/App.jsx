import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import AppHeader from './components/header';
import LandingPage from './components/LandingPage';
import TabSearch from './components/TabSearch';
import TabAssistant from './components/TabAssistant';
import AuthModal from './components/AuthModal';

const { Content } = Layout;

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [chatIntent, setChatIntent] = useState(null);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  // Load user từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('legal_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('legal_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('legal_user');
  };

  const handleTabChange = (key, intent = null) => {
    setActiveTab(key);
    setChatIntent(intent);                             
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage onNavigate={setActiveTab} />;
      case 'search':
        return <TabSearch />;
      case 'ai-assistant':
        return <TabAssistant defaultIntent={chatIntent} />;
      default:
        return <LandingPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout className="min-h-screen bg-[#faf9f7]">
      <AppHeader 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        user={user}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={handleLogout}
      />
      <Content>
        {renderContent()}
      </Content>

      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onLogin={handleLogin}
      />
    </Layout>
  );
};

export default App;