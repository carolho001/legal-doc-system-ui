import React from 'react';
import { Menu, Layout, Tooltip } from 'antd'; 
import { Search, MessageSquare, Scale, Home, User } from 'lucide-react';

const { Header } = Layout;

const AppHeader = ({ activeTab, onTabChange, isLoggedIn, user }) => {
  const mainMenuItems = [
    {
      key: 'home',
      icon: <Home size={16} />,
      label: 'Trang chủ',
    },
    {
      key: 'search',
      icon: <Search size={16} />,
      label: 'Tra cứu Luật',
    },
    {
      key: 'ai-assistant',
      icon: <MessageSquare size={16} />,
      label: 'Trợ lý pháp lý',
    },
  ];

  return (
    <Header 
      className="shadow-sm px-6 flex items-center justify-between sticky top-0 z-50"
      style={{ 
        height: 64, 
        lineHeight: '64px', 
        padding: '0 24px',
        background: '#faf9f7'
      }}
    >
      {/* Logo Section */}
      <div 
        className="flex items-center gap-3 cursor-pointer shrink-0"
        onClick={() => onTabChange('home')}
        style={{ minWidth: 180 }}
      >
        <div className="p-2 rounded-lg shadow-md shrink-0" style={{ background: '#722F37' }}>
          <Scale className="text-white" size={22} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold whitespace-nowrap font-['Playfair_Display']" style={{ color: '#2d2d2d' }}>
            Tra cứu Luật
          </span>
          <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: '#722F37' }}>
            Việt Nam
          </span>
        </div>
      </div>
      
      {/* Menu & Auth Section */}
      <div className="flex-1 flex justify-end items-center gap-4">
        <Menu
          mode="horizontal"
          selectedKeys={[activeTab]}
          onClick={(e) => onTabChange(e.key)}
          items={mainMenuItems}
          className="border-none font-medium text-sm bg-transparent"
          style={{ 
            justifyContent: 'flex-end',
            lineHeight: '62px',
            minWidth: 0,
            flex: 1
          }}
          overflowedIndicator={null} 
        />

        {/* Nút Auth với Tooltip */}
        <Tooltip 
          title={isLoggedIn ? (user?.name || 'Cá nhân') : 'Sign In / Sign Up'} 
          placement="bottomRight"
        >
          <div 
            className="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => onTabChange(isLoggedIn ? 'profile' : 'auth')}
            style={{ width: 40, height: 64 }}
          >
            {isLoggedIn && user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="avatar" 
                className="w-7 h-7 rounded-full object-cover border border-gray-200" 
              />
            ) : (
              <User size={20} className="text-[#2d2d2d]" /> 
            )}
          </div>
        </Tooltip>
      </div>

      <style>
        {`
          .ant-menu-horizontal {
            border-bottom: none !important;
          }
        `}
      </style>
    </Header>
  );
};

export default AppHeader;