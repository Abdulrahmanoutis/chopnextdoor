import React from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingCart, User, Star, ChevronRight } from 'lucide-react';

const HomeScreen: React.FC = () => {
  const { kitchens, followingIds, toggleFollow, cart } = useApp();
  const navigate = useNavigate();

  const liveKitchens = kitchens.filter(k => k.stories.length > 0);

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-[#0f0f0f] sticky top-0 z-40 border-b border-zinc-900/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-orange-600/20">C</div>
          <h1 className="text-xl font-bold tracking-tight">ChopNextDoor</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/cart')}
            className="relative p-2 rounded-full hover:bg-zinc-900 transition-colors active:scale-90 transform"
            aria-label="View Cart"
          >
            <ShoppingCart size={22} className="text-zinc-300" />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 bg-orange-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold border-2 border-[#0f0f0f] px-1">
                {cart.length}
              </span>
            )}
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 cursor-pointer hover:border-orange-500 transition-colors">
            <img src="https://picsum.photos/seed/user/100" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-2">
        <div className="bg-zinc-900 rounded-xl px-4 py-3 flex items-center space-x-3 text-zinc-500 border border-transparent hover:border-zinc-700 transition-all cursor-text">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <span className="text-sm font-medium">Search kitchens, dishes...</span>
        </div>
      </div>

      {/* Stories Bar */}
      <section className="mt-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Today's Menus</h2>
        </div>
        <div className="flex overflow-x-auto space-x-4 px-4 pb-4 no-scrollbar">
          {liveKitchens.map((kitchen) => (
            <div 
              key={kitchen.id} 
              className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer group"
              onClick={() => navigate(`/story/${kitchen.id}/0`)}
            >
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full p-[3px] bg-gradient-to-tr from-orange-400 to-yellow-600">
                  <div className="w-full h-full rounded-full border-2 border-[#0f0f0f] overflow-hidden">
                    <img src={kitchen.avatar} alt={kitchen.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                {kitchen.isLive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-black uppercase tracking-wider">
                    Live
                  </div>
                )}
              </div>
              <span className="text-[11px] font-medium text-zinc-400 max-w-[70px] truncate">{kitchen.ownerName}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Your Favorites */}
      <section className="mt-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Your Favorites</h2>
          <button className="text-orange-500 text-xs font-semibold flex items-center">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-4">
          {kitchens.slice(0, 2).map(kitchen => (
            <div 
              key={kitchen.id} 
              className="bg-[#181818] p-4 rounded-2xl flex items-center justify-between group hover:bg-[#202020] transition-colors cursor-pointer"
              onClick={() => navigate(`/kitchen/${kitchen.id}`)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src={kitchen.avatar} alt={kitchen.name} className="w-14 h-14 rounded-full object-cover border border-zinc-700" />
                  {kitchen.isLive && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#181818]"></span>}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm">{kitchen.name}</h3>
                    {kitchen.isLive && <span className="text-[10px] bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded uppercase">Live</span>}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{kitchen.tags.join(' • ')}</p>
                </div>
              </div>
              <button className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-orange-600/20 transition-all">
                View Menu
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Discovery Feed */}
      <section className="mt-8 px-4 pb-8">
        <h2 className="text-lg font-bold mb-4">Discover New Kitchens</h2>
        <div className="grid grid-cols-1 gap-6">
          {kitchens.map(kitchen => (
            <div 
              key={kitchen.id} 
              className="relative rounded-3xl overflow-hidden bg-[#181818] border border-zinc-800 group"
              onClick={() => navigate(`/kitchen/${kitchen.id}`)}
            >
              <div className="h-48 relative overflow-hidden">
                <img src={kitchen.coverImage} alt={kitchen.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="bg-black/50 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">New</span>
                  <span className="bg-orange-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">Top Rated</span>
                </div>
              </div>
              <div className="p-4 pt-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-base">{kitchen.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Specializing in {kitchen.tags[0]}</p>
                  </div>
                  <div className="flex items-center space-x-1 bg-zinc-800 px-2 py-1 rounded-lg">
                    <Star size={12} className="text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-white">{kitchen.rating}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(kitchen.id);
                  }}
                  className={`w-full mt-2 py-3 rounded-2xl text-sm font-bold transition-all ${
                    followingIds.has(kitchen.id) 
                      ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' 
                      : 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 active:scale-[0.98]'
                  }`}
                >
                  {followingIds.has(kitchen.id) ? 'Following ✓' : 'Follow Kitchen'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
