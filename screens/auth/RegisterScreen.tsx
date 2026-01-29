
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { User, Store, Mail, Lock, Phone, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerify = () => {
    // Simulated verification
    login(role);
    navigate('/');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] p-8 flex flex-col justify-center items-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-500/10 rounded-[30px] flex items-center justify-center mb-6">
          <ShieldCheck size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-black italic tracking-tighter mb-2">VERIFY IT'S YOU</h2>
        <p className="text-zinc-500 text-sm text-center mb-8">We sent a 4-digit code to your phone. Enter it below to secure your account.</p>
        
        <div className="flex space-x-4 mb-10">
          {otp.map((digit, i) => (
            <input 
              key={i}
              id={`otp-${i}`}
              type="number"
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              className="w-14 h-16 bg-zinc-900 border-2 border-zinc-800 rounded-2xl text-center text-2xl font-black focus:outline-none focus:border-orange-500 transition-all text-white"
            />
          ))}
        </div>

        <button 
          onClick={handleVerify}
          className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-base flex items-center justify-center space-x-2 shadow-xl shadow-orange-600/20 active:scale-95"
        >
          <span>Verify & Finish</span>
          <CheckCircle2 size={20} />
        </button>

        <button onClick={() => setStep(1)} className="mt-6 text-zinc-500 text-sm font-bold">Resend Code</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-8 flex flex-col justify-center animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black italic tracking-tighter">JOIN THE COMMUNITY</h1>
        <p className="text-zinc-500 text-sm mt-2">Start your home-kitchen journey today.</p>
      </div>

      <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800 mb-8">
        <button 
          onClick={() => setRole('customer')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold transition-all ${role === 'customer' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500'}`}
        >
          <User size={16} />
          <span>Customer</span>
        </button>
        <button 
          onClick={() => setRole('seller')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold transition-all ${role === 'seller' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500'}`}
        >
          <Store size={16} />
          <span>Seller</span>
        </button>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input type="email" placeholder="Email Address" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500 text-white" required />
          </div>
          <div className="relative">
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input type="tel" placeholder="Phone Number" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500 text-white" required />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input type="password" placeholder="Create Password" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500 text-white" required />
          </div>
        </div>

        <div className="flex items-start space-x-3 py-2">
          <input type="checkbox" className="mt-1 rounded bg-zinc-900 border-zinc-800 text-orange-500 focus:ring-orange-500" required />
          <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
            By creating an account, I agree to the <span className="text-orange-500 font-bold">Terms of Service</span> and <span className="text-orange-500 font-bold">Privacy Policy</span>.
          </p>
        </div>

        <button 
          type="submit"
          className="w-full bg-white text-black py-5 rounded-2xl font-black text-base flex items-center justify-center space-x-2 shadow-xl hover:bg-orange-500 hover:text-white transition-all active:scale-95"
        >
          <span>Continue to Verify</span>
          <ChevronRight size={20} />
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-zinc-500 text-sm">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/auth/login')}
            className="text-orange-500 font-bold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
