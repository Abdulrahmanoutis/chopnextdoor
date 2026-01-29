import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, LayoutList } from 'lucide-react';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-700">
      {/* Animated Success Icon */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
        <div className="relative w-32 h-32 bg-green-500/10 border-4 border-green-500/20 rounded-[40px] flex items-center justify-center shadow-2xl shadow-green-500/10 rotate-12 transition-transform hover:rotate-0 duration-500">
          <CheckCircle size={64} className="text-green-500" strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-black italic tracking-tighter">ORDER CONFIRMED!</h1>
        <div className="bg-zinc-900 border border-zinc-800 px-6 py-2 rounded-full w-fit mx-auto mb-6">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Order ID:</span>
          <span className="text-orange-500 font-black ml-2 text-sm">#1276-CDN</span>
        </div>
        
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">
          Your order from <span className="text-white font-bold">Sadiya's Spicy Bites</span> is being prepared and will be ready for pickup at <span className="text-white font-bold italic">12:30 PM</span>.
        </p>
      </div>

      <div className="w-full mt-16 space-y-4">
        <button 
          onClick={() => navigate('/orders')}
          className="w-full group bg-white text-black py-5 rounded-3xl font-black text-base flex items-center justify-center space-x-3 shadow-xl shadow-white/5 transition-all active:scale-95"
        >
          <LayoutList size={20} />
          <span>Track My Order</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <button 
          onClick={() => navigate('/')}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-5 rounded-3xl font-black text-base flex items-center justify-center space-x-3 border border-zinc-800 transition-all active:scale-95"
        >
          <Home size={20} />
          <span>Continue Browsing</span>
        </button>
      </div>

      <p className="mt-12 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
        A receipt has been sent to your registered email.
      </p>
    </div>
  );
};

export default OrderConfirmation;
