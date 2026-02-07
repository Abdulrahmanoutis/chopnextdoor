
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { ChevronLeft, Camera, MapPin, Clock, CreditCard, Image as ImageIcon, Settings, LogOut, Save, ChevronRight } from 'lucide-react';

const SellerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { logout, kitchens } = useApp();
  const kitchen = kitchens[0]; // Assuming first kitchen is the seller's

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Cover Header */}
      <div className="relative h-48 overflow-hidden bg-zinc-900">
        <img src={kitchen.coverImage} alt="" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-xl text-white">
          <ChevronLeft size={24} />
        </button>
        <button className="absolute bottom-4 right-4 p-3 bg-white text-black rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-black uppercase">
          <Camera size={16} />
          <span>Edit Cover</span>
        </button>
      </div>

      <div className="px-5 -mt-10 relative z-10 space-y-8">
        {/* Profile Info Card */}
        <div className="bg-[#181818] border border-zinc-800 rounded-[40px] p-6 shadow-2xl space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-[30px] border-4 border-[#181818] overflow-hidden shadow-xl">
                <img src={kitchen.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <button className="absolute -bottom-1 -right-1 p-2 bg-orange-600 text-white rounded-xl shadow-lg">
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter">{kitchen.name}</h2>
              <div className="flex items-center space-x-1 text-zinc-500 text-xs mt-1">
                <MapPin size={12} />
                <span>Victoria Island, Lagos</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1 mb-2 block">Kitchen Bio</label>
              <textarea 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-orange-500 text-zinc-300 min-h-[100px]"
                defaultValue="Authentic home-cooked meals prepared with love and organic spices. Fresh every day from my kitchen."
              />
            </div>
          </div>
        </div>

        {/* Business Settings Sections */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Business Setup</h3>
          
          <div className="space-y-3">
            {[
              { icon: Clock, label: 'Operating Hours', value: 'Mon - Sat, 9AM - 6PM' },
              { icon: MapPin, label: 'Kitchen Location', value: 'VI, Lagos State' },
              { icon: CreditCard, label: 'Bank Details', value: 'Kuda • **** 1276' },
              { icon: ImageIcon, label: 'Business Gallery', value: '12 Photos' },
              { icon: Settings, label: 'Notification Settings', value: 'Enabled' },
            ].map((item, idx) => (
              <button key={idx} className="w-full flex items-center justify-between p-5 bg-[#181818] border border-zinc-800 rounded-3xl hover:bg-zinc-800/50 transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-zinc-900 rounded-xl text-zinc-500 group-hover:text-orange-500 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-white">{item.label}</span>
                    <span className="text-[10px] text-zinc-500 font-medium">{item.value}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-zinc-700" />
              </button>
            ))}
          </div>
        </div>

        {/* Save & Sign Out */}
        <div className="flex flex-col space-y-4 pt-4 pb-10">
          <button className="w-full bg-white text-black py-5 rounded-[32px] font-black text-base flex items-center justify-center space-x-3 shadow-xl transition-all active:scale-95">
            <Save size={20} />
            <span>Save All Changes</span>
          </button>
          
          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center space-x-3 p-5 text-red-500/60 font-bold text-sm hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out From ChopNextDoor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
