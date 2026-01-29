
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MessageCircle, Star, TrendingUp, Users } from 'lucide-react';

const FollowersScreen: React.FC = () => {
  const navigate = useNavigate();

  const followers = [
    { id: 'f1', name: 'James Obi', joined: '2 months ago', badge: 'Regular', orders: 15, avatar: 'https://picsum.photos/seed/f1/100' },
    { id: 'f2', name: 'Sarah Ken', joined: '1 week ago', badge: 'New', orders: 1, avatar: 'https://picsum.photos/seed/f2/100' },
    { id: 'f3', name: 'Femi Ade', joined: '3 weeks ago', badge: 'Regular', orders: 8, avatar: 'https://picsum.photos/seed/f3/100' },
    { id: 'f4', name: 'Amaka V.', joined: '4 months ago', badge: 'VIP', orders: 42, avatar: 'https://picsum.photos/seed/f4/100' },
    { id: 'f5', name: 'David O.', joined: '5 months ago', badge: 'Regular', orders: 12, avatar: 'https://picsum.photos/seed/f5/100' },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="p-6 bg-gradient-to-b from-orange-600/20 to-transparent">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800">
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-black italic tracking-tighter">850</h1>
            <p className="text-[10px] font-black uppercase text-orange-500 tracking-[0.2em]">Total Followers</p>
          </div>
          <button className="p-2 bg-zinc-900 rounded-xl border border-zinc-800">
            <TrendingUp size={24} className="text-green-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-4 rounded-3xl">
            <div className="flex items-center space-x-2 mb-1">
              <Users size={14} className="text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">New Today</span>
            </div>
            <span className="text-xl font-black">+14</span>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-4 rounded-3xl">
            {/* Fix: Replaced misplaced curly brace with a closing div tag to correct syntax */}
            <div className="flex items-center space-x-2 mb-1">
              <Star size={14} className="text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Loyalty Rate</span>
            </div>
            <span className="text-xl font-black">68%</span>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
          <input 
            type="text" 
            placeholder="Find a follower..." 
            className="w-full bg-[#181818] border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>

        {/* List */}
        <div className="space-y-4">
          {followers.map(follower => (
            <div key={follower.id} className="bg-[#181818] border border-zinc-800 rounded-[32px] p-4 flex items-center justify-between group hover:bg-zinc-800/40 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-zinc-700">
                  <img src={follower.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{follower.name}</h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] text-zinc-500">Joined {follower.joined}</span>
                    <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      follower.badge === 'VIP' ? 'bg-orange-500 text-white' : 
                      follower.badge === 'Regular' ? 'bg-zinc-800 text-orange-500 border border-orange-500/20' : 
                      'bg-zinc-800 text-zinc-500'
                    }`}>
                      {follower.badge}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right mr-2">
                  <span className="block text-xs font-black">{follower.orders}</span>
                  <span className="text-[8px] font-bold text-zinc-600 uppercase">Orders</span>
                </div>
                <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-orange-500 hover:bg-orange-600 hover:text-white transition-all active:scale-90">
                  <MessageCircle size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowersScreen;
