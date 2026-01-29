import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Search, Filter, Star, Clock, MapPin, X } from 'lucide-react';

const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const { kitchens } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Available Now', 'Near Me', 'Traditional', 'Small Chops', 'Healthy'];

  const searchResults = useMemo(() => {
    if (!searchTerm && activeFilter === 'All') return [];
    
    return kitchens.filter(kitchen => {
      const matchesSearch = searchTerm === '' || 
        kitchen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kitchen.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = activeFilter === 'All' || 
        (activeFilter === 'Available Now' && kitchen.isLive) ||
        (activeFilter === 'Traditional' && kitchen.tags.includes('Tuwo')) ||
        (activeFilter === 'Small Chops' && kitchen.tags.includes('Masa & Suya Expert')) ||
        true; // Simplified for demo

      return matchesSearch && matchesFilter;
    });
  }, [kitchens, searchTerm, activeFilter]);

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <div className="p-4 space-y-4 border-b border-zinc-900 sticky top-0 bg-[#0f0f0f] z-40">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="What are you craving today?" 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-orange-500 transition-all"
            autoFocus
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                activeFilter === filter ? 'bg-orange-600 border-orange-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Search Results</h2>
            {searchResults.map(kitchen => (
              <div 
                key={kitchen.id}
                onClick={() => navigate(`/kitchen/${kitchen.id}`)}
                className="bg-[#181818] rounded-[32px] overflow-hidden border border-zinc-800 group"
              >
                <div className="h-32 relative">
                  <img src={kitchen.coverImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent"></div>
                  {kitchen.isLive && (
                    <span className="absolute top-4 right-4 bg-orange-600 text-[8px] font-black px-2 py-1 rounded-lg uppercase">Live</span>
                  )}
                </div>
                <div className="p-5 flex justify-between items-end">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">{kitchen.name}</h3>
                    <div className="flex items-center space-x-3 text-xs text-zinc-500">
                      <div className="flex items-center space-x-1">
                        <Star size={12} className="text-orange-500 fill-orange-500" />
                        <span className="text-white font-bold">{kitchen.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin size={12} />
                        <span>2.4km</span>
                      </div>
                    </div>
                  </div>
                  <button className="bg-zinc-800 p-3 rounded-2xl text-orange-500 hover:bg-orange-600 hover:text-white transition-all">
                    <Filter size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : !searchTerm ? (
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Trending Searches</h2>
              <div className="flex flex-wrap gap-2">
                {['Masa with Honey', 'Spicy Ram Suya', 'Pounded Yam', 'Zobo', 'Small Chops Box'].map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setSearchTerm(tag)}
                    className="bg-zinc-800/50 hover:bg-zinc-700 px-5 py-3 rounded-2xl text-xs font-bold transition-all border border-zinc-800"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Recent Collections</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Traditional Tuwo', img: 'https://picsum.photos/seed/tuwo/300' },
                  { label: 'Hot Masa', img: 'https://picsum.photos/seed/masa_c/300' },
                ].map(item => (
                  <div key={item.label} className="relative aspect-square rounded-[32px] overflow-hidden group cursor-pointer">
                    <img src={item.img} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                      <span className="text-sm font-black uppercase italic tracking-tighter text-white">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 opacity-40">
            <div className="flex justify-center">
              <Search size={48} className="text-zinc-600" />
            </div>
            <p className="text-sm font-medium">We couldn't find any kitchens matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;
