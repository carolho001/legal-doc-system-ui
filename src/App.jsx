import React, { useState } from 'react';
import { Layout } from 'antd';
import AppHeader from './components/header';
import LandingPage from './components/LandingPage';
import TabSearch from './components/TabSearch';
import TabQA from './components/TabQA';
import TabSummary from './components/TabSummary';

const { Content } = Layout;

const App = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage onNavigate={setActiveTab} />;
      case 'search':
        return <TabSearch />;
      case 'qa':
        return <TabQA />;
      case 'summary':
        return <TabSummary />;
      default:
        return <LandingPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout className="min-h-screen bg-[#faf9f7]">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <Content>
        {renderContent()}
      </Content>
    </Layout>
  );
};

export default App;