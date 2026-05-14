import React, { useState } from 'react';
import { X, User, Lock, Mail, Eye, EyeOff, Scale } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Giả lập API call
    await new Promise(r => setTimeout(r, 800));
    
    // Mock user data
    const mockUser = mode === 'login' 
      ? { name: 'Nguyễn Văn A', email: form.email, avatar: null }
      : { name: form.name, email: form.email, avatar: null };
    
    onLogin(mockUser);
    setLoading(false);
    onClose();
    setForm({ email: '', password: '', name: '' });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 mx-4">
        {/* Header gradient */}
        <div 
          className="px-8 pt-8 pb-12 text-center relative"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d1f3e 50%, #722F37 100%)' }}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-14 h-14 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
            <Scale size={28} className="text-[#e8d5b7]" />
          </div>
          <h2 className="text-xl font-bold text-white font-['Playfair_Display']">
            {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {mode === 'login' 
              ? 'Truy cập hệ thống tra cứu pháp luật' 
              : 'Tham gia cộng đồng pháp lý'}
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-6 -mt-6 bg-white rounded-t-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-gray-50 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-gray-50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-gray-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#722F37] text-white! text-sm font-semibold hover:bg-[#5a252c] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-5 text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <p>
                Chưa có tài khoản?{' '}
                <button 
                  onClick={() => setMode('register')}
                  className="text-[#722F37] font-semibold hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            ) : (
              <p>
                Đã có tài khoản?{' '}
                <button 
                  onClick={() => setMode('login')}
                  className="text-[#722F37] font-semibold hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;