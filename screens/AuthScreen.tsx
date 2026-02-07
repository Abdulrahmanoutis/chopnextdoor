import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ChevronRight, Mail, Lock, User, Store } from 'lucide-react';

const AuthScreen: React.FC = () => {
  const { login, userRole, setUserRole } = useApp();
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    login(userRole);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-8 max-w-lg mx-auto animate-in fade-in duration-700">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-orange-600 rounded-[28px] flex items-center justify-center font-black text-4xl text-white shadow-2xl shadow-orange-600/30 mx-auto mb-4 transform rotate-6">C</div>
        <h1 className="text-3xl font-black italic tracking-tighter">CHOPNEXTDOOR</h1>
        <p className="text-zinc-500 text-sm mt-2">Authentic home tastes, shared by neighbors.</p>
      </div>

      <div className="w-full bg-[#181818] border border-zinc-800 p-6 rounded-[32px] space-y-6">
        <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800">
          <button 
            onClick={() => setUserRole('customer')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold transition-all ${userRole === 'customer' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            <User size={16} />
            <span>Customer</span>
          </button>
          <button 
            onClick={() => setUserRole('seller')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold transition-all ${userRole === 'seller' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            <Store size={16} />
            <span>Seller</span>
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-all text-white" 
                required
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-all text-white" 
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black py-5 rounded-2xl font-black text-base flex items-center justify-center space-x-2 shadow-xl hover:bg-orange-500 hover:text-white transition-all active:scale-95"
          >
            <span>{isLogin ? 'Login Now' : 'Create Account'}</span>
            <ChevronRight size={20} />
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-500 text-xs font-bold hover:text-orange-500 transition-colors"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>

      <p className="mt-10 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
        By continuing, you agree to our Terms & Privacy
      </p>
    </div>
  );
};

export default AuthScreen;
