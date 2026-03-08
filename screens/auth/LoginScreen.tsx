
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Mail, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { authAPI, setAuthToken } from '../../services/api';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const data = await authAPI.login(formData.identifier, formData.password);
      setAuthToken(data.token);
      login('customer');
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-8 flex flex-col justify-center animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-orange-600 rounded-[28px] flex items-center justify-center font-black text-4xl text-white shadow-2xl shadow-orange-600/30 mx-auto mb-4 transform -rotate-6">C</div>
        <h1 className="text-3xl font-black italic tracking-tighter">CHOPNEXTDOOR</h1>
        <p className="text-zinc-500 text-sm mt-2">Welcome back to the neighborhood.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-all text-white" 
              value={formData.identifier}
              onChange={(e) => setFormData({...formData, identifier: e.target.value})}
              required
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-orange-500 transition-all text-white" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <button type="button" className="text-orange-500 text-xs font-bold hover:underline">Forgot Password?</button>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black py-5 rounded-2xl font-black text-base flex items-center justify-center space-x-2 shadow-xl hover:bg-orange-500 hover:text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{isSubmitting ? 'Logging in...' : 'Login Now'}</span>
          <ChevronRight size={20} />
        </button>
      </form>
      {error && (
        <div className="mt-4 text-center text-sm text-red-400">{error}</div>
      )}

      <div className="mt-10 text-center">
        <p className="text-zinc-500 text-sm mb-3">Don't have an account?</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/auth/register/customer')}
            className="bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-xs font-bold hover:border-orange-500 transition-colors"
          >
            Register as Buyer
          </button>
          <button
            onClick={() => navigate('/auth/register/seller')}
            className="bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-xs font-bold hover:border-orange-500 transition-colors"
          >
            Register as Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
