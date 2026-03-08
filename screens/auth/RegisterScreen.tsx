
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { User, Store, Mail, Lock, Phone, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { authAPI, setAuthToken } from '../../services/api';

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { role: roleParam } = useParams<{ role?: string }>();
  const { login } = useApp();
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [otp, setOtp] = useState(['', '', '', '']);
  const [formData, setFormData] = useState({ email: '', phone: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const role: 'customer' | 'seller' = roleParam === 'seller' ? 'seller' : 'customer';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await authAPI.register({
        username: formData.email,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        user_type: role.toUpperCase() as 'CUSTOMER' | 'SELLER',
      });
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const data = await authAPI.login(formData.email, formData.password);
      setAuthToken(data.token);
      login(role);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification/login failed');
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={isSubmitting}
          className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-base flex items-center justify-center space-x-2 shadow-xl shadow-orange-600/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{isSubmitting ? 'Verifying...' : 'Verify & Finish'}</span>
          <CheckCircle2 size={20} />
        </button>

        <button onClick={() => setStep(1)} className="mt-6 text-zinc-500 text-sm font-bold">Resend Code</button>
        {error && (
          <div className="mt-4 text-center text-sm text-red-400">{error}</div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-8 flex flex-col justify-center animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black italic tracking-tighter">JOIN THE COMMUNITY</h1>
        <p className="text-zinc-500 text-sm mt-2">Start your {role === 'seller' ? 'seller' : 'buyer'} journey today.</p>
      </div>

      <div className="flex items-center justify-center space-x-2 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800 mb-8">
        {role === 'seller' ? <Store size={16} className="text-orange-500" /> : <User size={16} className="text-orange-500" />}
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Registering as {role === 'seller' ? 'Seller' : 'Buyer'}
        </span>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500 text-white" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required 
            />
          </div>
          <div className="relative">
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500 text-white" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required 
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input 
              type="password" 
              placeholder="Create Password" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500 text-white" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required 
            />
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
          disabled={isSubmitting}
          className="w-full bg-white text-black py-5 rounded-2xl font-black text-base flex items-center justify-center space-x-2 shadow-xl hover:bg-orange-500 hover:text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{isSubmitting ? 'Submitting...' : 'Continue to Verify'}</span>
          <ChevronRight size={20} />
        </button>
      </form>
      {error && (
        <div className="mt-4 text-center text-sm text-red-400">{error}</div>
      )}

      <div className="mt-10 text-center">
        <p className="text-zinc-500 text-sm">
          Already have an account? <button onClick={() => navigate('/auth/login')} className="text-orange-500 font-bold hover:underline">Login</button>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
