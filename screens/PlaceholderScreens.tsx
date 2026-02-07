import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { User, ChevronRight, MapPin, Settings, LogOut, Repeat } from 'lucide-react';

export const ProfilePlaceholder: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, setUserRole, logout } = useApp();
  
  return (
    <div className="animate-in fade-in duration-500">
      <div className="p-6 bg-gradient-to-b from-orange-600/10 to-transparent">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">Profile</h1>
          <button className="p-2 bg-zinc-900 rounded-xl"><Settings size={20} /></button>
        </div>
        
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-20 h-20 rounded-3xl border-4 border-zinc-900 overflow-hidden shadow-2xl">
            <img src="https://picsum.photos/seed/user/200" alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-black">Alex Thompson</h2>
            <div className="flex items-center space-x-1 text-zinc-500 text-xs mt-1">
              <MapPin size={12} />
              <span>Victoria Island, Lagos</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-[#181818] p-4 rounded-2xl border border-zinc-800 text-center">
            <span className="block text-xl font-black text-white">{userRole === 'customer' ? '12' : '450'}</span>
            <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">{userRole === 'customer' ? 'Total Orders' : 'Sales'}</span>
          </div>
          <div className="bg-[#181818] p-4 rounded-2xl border border-zinc-800 text-center">
            <span className="block text-xl font-black text-orange-500">{userRole === 'customer' ? '₦42k' : '₦1.2M'}</span>
            <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">{userRole === 'customer' ? 'Spent' : 'Revenue'}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => setUserRole(userRole === 'customer' ? 'seller' : 'customer')}
            className="w-full flex items-center justify-between p-5 bg-orange-600/10 border border-orange-600/30 rounded-2xl hover:bg-orange-600/20 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-orange-600 text-white rounded-xl">
                <Repeat size={18} />
              </div>
              <span className="text-sm font-bold">Switch to {userRole === 'customer' ? 'Seller' : 'Customer'} Mode</span>
            </div>
            <ChevronRight size={18} className="text-orange-500" />
          </button>

          {[
            { icon: User, label: 'Edit Profile' },
            { icon: MapPin, label: 'Saved Addresses' },
            { icon: Settings, label: 'Preferences' }
          ].map((item, idx) => (
            <button key={idx} className="w-full flex items-center justify-between p-5 bg-[#181818] rounded-2xl border border-zinc-800 hover:bg-zinc-800/50 transition-all group">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-zinc-900 rounded-xl text-zinc-400 group-hover:text-orange-500 transition-colors">
                  <item.icon size={18} />
                </div>
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-zinc-700" />
            </button>
          ))}

          <button 
            onClick={() => logout()}
            className="w-full flex items-center space-x-4 p-5 text-red-500/60 font-bold text-sm hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
