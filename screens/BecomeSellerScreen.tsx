import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Store } from 'lucide-react';
import { useApp } from '../store/AppContext';

const BecomeSellerScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole } = useApp();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/profile')} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Seller Onboarding</h1>
        <div className="w-10" />
      </div>

      <div className="bg-[#181818] border border-zinc-800 rounded-3xl p-6">
        <div className="w-14 h-14 rounded-2xl bg-orange-600/20 text-orange-500 flex items-center justify-center mb-5">
          <Store size={28} />
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-2">Start Selling on ChopNextDoor</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Seller access is enabled through a dedicated onboarding step. This separates buying and selling experiences.
        </p>

        <div className="space-y-3 mb-8">
          {[
            'Create and manage your daily menu',
            'Track incoming orders in real time',
            'Set up your profile and business details',
          ].map((item) => (
            <div key={item} className="flex items-start space-x-3 text-sm">
              <BadgeCheck size={16} className="text-orange-500 mt-0.5" />
              <span className="text-zinc-300">{item}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setUserRole('seller');
            navigate('/seller/dashboard');
          }}
          className="w-full bg-white text-black py-4 rounded-2xl font-black hover:bg-orange-500 hover:text-white transition-colors"
        >
          Continue as Seller
        </button>
      </div>
    </div>
  );
};

export default BecomeSellerScreen;
