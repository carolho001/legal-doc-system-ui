import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Spin, Avatar, Card, Typography, List, Empty, Tooltip } from 'antd';
import { 
  Send, Bot, User, Loader2, MessageCircle, Clock, Plus, 
  Trash2, ChevronRight, Scale, Sparkles, History
} from 'lucide-react';
import { askQuestion } from '../services/api';

const { TextArea } = Input;
const { Text, Title } = Typography;

const TabQA = () => {
  const [sessions, setSessions] = useState([
    {
      id: 'default',
      title: 'Cuộc trò chuyện mới',
      messages: [
        { 
          role: 'bot', 
          content: 'Xin chào! Tôi là trợ lý pháp luật thông minh. Tôi có thể giúp bạn tìm hiểu về Hiến pháp, Dân sự, Hình sự, Lao động và Đất đai. Bạn muốn hỏi gì?' 
        }
      ],
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [activeSessionId, setActiveSessionId] = useState('default');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession.messages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeSessionId]);

  const generateTitle = (question) => {
    return question.length > 30 ? question.substring(0, 30) + '...' : question;
  };

  const handleNewChat = () => {
    const newSession = {
      id: Date.now().toString(),
      title: 'Cuộc trò chuyện mới',
      messages: [
        { 
          role: 'bot', 
          content: 'Xin chào! Tôi là trợ lý pháp luật thông minh. Tôi có thể giúp bạn tìm hiểu về Hiến pháp, Dân sự, Hình sự, Lao động và Đất đai. Bạn muốn hỏi gì?' 
        }
      ],
      timestamp: new Date().toISOString()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput('');
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    if (sessions.length === 1) {
      const cleared = {
        ...sessions[0],
        messages: [
          { 
            role: 'bot', 
            content: 'Xin chào! Tôi là trợ lý pháp luật thông minh. Tôi có thể giúp bạn tìm hiểu về Hiến pháp, Dân sự, Hình sự, Lao động và Đất đai. Bạn muốn hỏi gì?' 
          }
        ],
        title: 'Cuộc trò chuyện mới'
      };
      setSessions([cleared]);
      setActiveSessionId('default');
      return;
    }
    
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(sessions.find(s => s.id !== sessionId)?.id || 'default');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const isFirstUserMsg = s.messages.filter(m => m.role === 'user').length === 0;
        return {
          ...s,
          title: isFirstUserMsg ? generateTitle(userMsg) : s.title,
          messages: [...s.messages, { role: 'user', content: userMsg }]
        };
      }
      return s;
    }));
    
    setInput('');
    setLoading(true);

    const answer = await askQuestion(userMsg);
    
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: [...s.messages, { role: 'bot', content: answer }]
        };
      }
      return s;
    }));
    
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const suggestions = [
    'Quyền của người lao động là gì?',
    'Thủ tục ly hôn theo luật Dân sự?',
    'Các loại hình phạt trong Bộ luật Hình sự?',
    'Quyền sử dụng đất theo Luật Đất đai?'
  ];

  const isEmptyChat = messages.length === 1 && messages[0].role === 'bot';

  return (
    <div className="h-[calc(100vh-64px)] flex bg-[#faf9f7]">
      {/* Sidebar - Chat History */}
      <div 
        className={`bg-[#1e293b] border-r border-[#334155] flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#334155]">
          <Button
            type="primary"
            block
            icon={<Plus size={16} />}
            onClick={handleNewChat}
            className="h-10 font-medium flex items-center justify-center gap-2 rounded-lg border-none"
            style={{ background: '#8b1a2b' }}
          >
            Cuộc trò chuyện mới
          </Button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-4 py-2">
            <Text className="text-[#94a3b8] text-xs uppercase tracking-wider font-semibold">
              Lịch sử
            </Text>
          </div>
          
          <List
            dataSource={sessions}
            renderItem={(session) => (
              <List.Item 
                className="border-none! px-2! py-1!"
                onClick={() => setActiveSessionId(session.id)}
              >
                <div 
                  className={`w-full px-3 py-3 rounded-lg cursor-pointer flex items-center gap-3 group transition-all border ${
                    activeSessionId === session.id 
                      ? 'bg-[#8b1a2b]/20 border-[#8b1a2b]/30' 
                      : 'hover:bg-[#334155]/50 border-transparent'
                  }`}
                >
                  <MessageCircle 
                    size={16} 
                    className={activeSessionId === session.id ? 'text-[#c9a96e]' : 'text-[#64748b]'} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm truncate ${
                      activeSessionId === session.id ? 'text-white font-medium' : 'text-[#94a3b8]'
                    }`}>
                      {session.title}
                    </div>
                    <div className="text-xs text-[#64748b] flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {formatTime(session.timestamp)}
                    </div>
                  </div>
                  <Tooltip title="Xóa">
                    <button 
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#ef4444]/20 rounded transition-all text-[#64748b] hover:text-[#ef4444]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </Tooltip>
                </div>
              </List.Item>
            )}
          />
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#334155]">
          <div className="flex items-center gap-3">
            <Avatar className="bg-[#8b1a2b] text-white" size="small">
              <Scale size={16} />
            </Avatar>
            <div>
              <div className="text-white text-sm font-medium">Tra cứu Luật</div>
              <div className="text-[#64748b] text-xs">Trợ lý pháp luật AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute left-4 top-20 z-10 w-8 h-8 bg-[#1e293b] border border-[#334155] rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"
      >
        <History size={16} />
      </button>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-[#e8e4e0] px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8b1a2b]/10 flex items-center justify-center">
              <Sparkles size={16} className="text-[#8b1a2b]" />
            </div>
            <div>
              <Text strong className="text-[#2d2d2d] text-sm block">
                {activeSession.title}
              </Text>
              <Text className="text-[#9a8478] text-xs">
                {messages.length} tin nhắn
              </Text>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {isEmptyChat ? (
            <div className="h-full flex flex-col items-center justify-center px-6">
              <div className="text-center max-w-lg">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#8b1a2b] rounded-2xl flex items-center justify-center shadow-lg">
                  <Scale size={32} className="text-white" />
                </div>
                
                <Title level={3} className="text-[#2d2d2d] mb-2 font-['Playfair_Display']">
                  Trợ lý Pháp luật AI
                </Title>
                <Text className="text-[#9a8478] block mb-8">
                  Hỏi đáp về pháp luật Việt Nam
                </Text>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(s);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="text-left px-4 py-3 bg-white border border-[#e8e4e0] rounded-xl hover:border-[#8b1a2b] hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#4a4a4a] group-hover:text-[#8b1a2b] transition-colors">
                          {s}
                        </span>
                        <ChevronRight 
                          size={14} 
                          className="text-gray-300 group-hover:text-[#8b1a2b] group-hover:translate-x-1 transition-all" 
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <Avatar 
                    icon={msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    className={msg.role === 'user' ? 'bg-[#8b1a2b] shrink-0' : 'bg-[#6b5b4e] shrink-0'}
                    size="default"
                  />
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#8b1a2b] text-white rounded-tr-none'
                        : 'bg-white text-[#2d2d2d] rounded-tl-none border border-[#e8e4e0] shadow-sm'
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`text-xs font-semibold ${msg.role === 'user' ? 'text-white/70' : 'text-[#8b1a2b]'}`}>
                        {msg.role === 'user' ? 'Bạn' : 'Trợ lý pháp luật'}
                      </span>
                      <span className={`text-xs ${msg.role === 'user' ? 'text-white/40' : 'text-[#9a8478]'}`}>
                        {formatTime(new Date().toISOString())}
                      </span>
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-4 flex-row">
                  <Avatar icon={<Bot size={16} />} className="bg-[#6b5b4e] shrink-0" />
                  <div className="bg-white rounded-2xl rounded-tl-none px-5 py-3.5 flex items-center gap-3 border border-[#e8e4e0] shadow-sm">
                    <Loader2 className="animate-spin text-[#8b1a2b]" size={16} />
                    <span className="text-sm text-[#9a8478]">Đang phân tích câu hỏi...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-[#e8e4e0] bg-white px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end bg-[#faf9f7] rounded-xl border border-[#e8e4e0] p-2 focus-within:border-[#8b1a2b] focus-within:shadow-md transition-all">
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi về pháp luật..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm"
                style={{ 
                  background: 'transparent',
                  boxShadow: 'none'
                }}
              />
              <Button
                type="primary"
                icon={<Send size={16} />}
                onClick={handleSend}
                loading={loading}
                disabled={!input.trim()}
                className="flex items-center justify-center h-10 w-10 bg-[#8b1a2b] hover:bg-[#a02035] rounded-lg shrink-0 p-0 border-none"
              />
            </div>
            <Text className="text-[#9a8478] text-xs text-center block mt-2">
              Trợ lý pháp luật AI - Dữ liệu mô phỏng cho mục đích học tập
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabQA;