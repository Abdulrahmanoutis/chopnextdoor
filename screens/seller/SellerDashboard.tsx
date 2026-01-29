
import React from 'react';
import { useApp } from '../../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Users, PlusCircle, List, ArrowUpRight, ChevronRight, Bell } from 'lucide-react';

const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { kitchens } = useApp();
  const sellerData = kitchens[0]; // Assuming first kitchen is the logged-in seller for demo

  return (
    <div className="animate-in fade-in duration-500 p-5 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl border-2 border-orange-600/30 overflow-hidden shadow-xl">
            <img src={sellerData.avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-black">Hello, {sellerData.ownerName}! 👋</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Kitchen Admin</p>
          </div>
        </div>
        <button className="relative p-2 bg-zinc-900 rounded-xl border border-zinc-800">
          <Bell size={20} className="text-zinc-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border border-black"></span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#181818] border border-zinc-800 p-5 rounded-[32px] space-y-3 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-600/10 rounded-full blur-2xl group-hover:bg-orange-600/20 transition-all"></div>
          <div className="flex items-center justify-between">
            <div className="p-2 bg-orange-600/10 rounded-xl text-orange-500">
              <ShoppingBag size={18} />
            </div>
            <span className="text-[10px] font-black text-green-500 flex items-center">
              +12% <ArrowUpRight size={10} />
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Today's Orders</span>
            <h2 className="text-2xl font-black">12</h2>
          </div>
        </div>

        <div className="bg-[#181818] border border-zinc-800 p-5 rounded-[32px] space-y-3 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-600/10 rounded-full blur-2xl group-hover:bg-green-600/20 transition-all"></div>
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-600/10 rounded-xl text-green-500">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Earnings</span>
            <h2 className="text-2xl font-black">₦24,500</h2>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Quick Actions</h2>
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/seller/create-menu')}
            className="w-full bg-orange-600 hover:bg-orange-700 p-5 rounded-3xl flex items-center justify-between shadow-xl shadow-orange-600/20 transition-all active:scale-95"
          >
            <div className="flex items-center space-x-4">
              <PlusCircle size={24} className="text-white" />
              <div className="text-left">
                <span className="block font-black text-sm">Create Today's Menu</span>
                <span className="text-[10px] font-bold text-white/70">Post a story for followers</span>
              </div>
            </div>
            <ChevronRight size={20} />
          </button>

          <button 
            onClick={() => navigate('/seller/menu')}
            className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between transition-all active:scale-95"
          >
            <div className="flex items-center space-x-4">
              <List size={24} className="text-orange-500" />
              <div className="text-left">
                <span className="block font-black text-sm">Manage Master Menu</span>
                <span className="text-[10px] font-bold text-zinc-500">Edit prices, stocks & photos</span>
              </div>
            </div>
            <ChevronRight size={20} className="text-zinc-700" />
          </button>
        </div>
      </div>

      {/* Followers Card */}
      <div className="bg-[#181818] border border-zinc-800 p-6 rounded-[32px] flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#181818] overflow-hidden">
                <img src={`https://picsum.photos/seed/fan${i}/100`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-[#181818] bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">+1.2k</div>
          </div>
          <div>
            <h3 className="font-bold text-sm">Followers</h3>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Growing every day</p>
          </div>
        </div>
        <button className="bg-zinc-800 px-4 py-2 rounded-xl text-xs font-bold text-white">View All</button>
      </div>

      {/* Recent Orders List */}
      <div className="space-y-4 pb-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Incoming Orders</h2>
          <button className="text-orange-500 text-[10px] font-bold uppercase">View All</button>
        </div>
        <div className="space-y-3">
          {[
            { id: '1277', name: 'James Obi', items: 'Masa x 2, Zobo x 1', time: '5m ago' },
            { id: '1278', name: 'Sarah Ken', items: 'Grilled Chicken x 1', time: '12m ago' },
          ].map(order => (
            <div key={order.id} className="bg-zinc-900/50 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-zinc-800">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center font-bold text-xs text-zinc-500">{order.id}</div>
                <div>
                  <h4 className="font-bold text-sm">{order.name}</h4>
                  <p className="text-[10px] text-zinc-500">{order.items}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-orange-500/60 italic">{order.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
