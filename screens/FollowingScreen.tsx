import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Star, ChevronRight, Heart, Users } from 'lucide-react';

const FollowingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { kitchens, followingIds } = useApp();
  const [activeTab, setActiveTab] = useState<'stories' | 'kitchens'>('stories');

  const followedKitchens = kitchens.filter(k => followingIds.has(k.id));
  const kitchensWithStories = followedKitchens.filter(k => k.stories.length > 0);

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <div className="p-4 flex flex-col space-y-4 border-b border-zinc-900 sticky top-0 bg-[#0f0f0f] z-40">
        <h1 className="text-xl font-bold">Following</h1>
        
        {/* Tabs */}
        <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800">
          <button 
            onClick={() => setActiveTab('stories')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'stories' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            Stories
          </button>
          <button 
            onClick={() => setActiveTab('kitchens')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'kitchens' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            Kitchens
          </button>
        </div>
      </div>

      <div className="p-5 space-y-8">
        {activeTab === 'stories' && (
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-600">Active Menus</h2>
            {kitchensWithStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {kitchensWithStories.map(kitchen => (
                  <div 
                    key={kitchen.id} 
                    onClick={() => navigate(`/story/${kitchen.id}/0`)}
                    className="relative aspect-[4/5] rounded-[32px] overflow-hidden group shadow-xl"
                  >
                    <img src={kitchen.stories[0].image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-orange-500 p-0.5">
                        <img src={kitchen.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[10px] font-black uppercase text-orange-500 mb-1">{kitchen.name}</p>
                      <h3 className="text-sm font-bold text-white leading-tight">{kitchen.stories[0].foodName}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 opacity-40">
                <Heart size={48} className="mx-auto text-zinc-600" />
                <p className="text-sm font-medium">No active stories from kitchens you follow.</p>
              </div>
            )}
          </section>
        )}

        {activeTab === 'kitchens' && (
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-600">Your Favorites</h2>
            {followedKitchens.length > 0 ? (
              <div className="space-y-3">
                {followedKitchens.map(kitchen => (
                  <div 
                    key={kitchen.id}
                    onClick={() => navigate(`/kitchen/${kitchen.id}`)}
                    className="bg-[#181818] p-4 rounded-[32px] border border-zinc-800 flex items-center justify-between group cursor-pointer hover:border-zinc-700 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img src={kitchen.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover" />
                        {kitchen.isLive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#181818]"></div>}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{kitchen.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1 text-zinc-500 text-[10px]">
                            <Star size={10} className="text-orange-500 fill-orange-500" />
                            <span>{kitchen.rating}</span>
                          </div>
                          {kitchen.isLive && <span className="text-[8px] font-black text-orange-500 uppercase">Live Now</span>}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-zinc-700" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 opacity-40">
                <Users size={48} className="mx-auto text-zinc-600" />
                <p className="text-sm font-medium">Start following kitchens to see them here.</p>
              </div>
            )}
          </section>
        )}

        {/* Discovery Section */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-orange-500">Discover New Kitchens</h2>
          <div className="space-y-4">
            {kitchens.filter(k => !followingIds.has(k.id)).slice(0, 2).map(kitchen => (
              <div 
                key={kitchen.id}
                onClick={() => navigate(`/kitchen/${kitchen.id}`)}
                className="relative h-32 rounded-[32px] overflow-hidden group"
              >
                <img src={kitchen.coverImage} alt="" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <div>
                    <h3 className="font-black text-lg italic tracking-tighter">{kitchen.name}</h3>
                    <p className="text-[10px] font-bold text-zinc-300 uppercase">{kitchen.tags[0]}</p>
                  </div>
                  <button className="bg-white text-black text-[10px] font-black px-4 py-2 rounded-xl uppercase hover:bg-orange-500 hover:text-white transition-all">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FollowingScreen;
