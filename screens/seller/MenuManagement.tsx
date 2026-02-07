
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { menuAPI, MenuItemApi } from '../../services/api';
import { MenuItem } from '../../types';
import { useApp } from '../../store/AppContext';

const MenuManagement: React.FC = () => {
  const navigate = useNavigate();
  const { kitchens } = useApp();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadMenu = async () => {
      try {
        const kitchenId = kitchens[0]?.id;
        if (!kitchenId) {
          throw new Error('No kitchen found for this seller');
        }
        const menus = await menuAPI.getByKitchen(kitchenId);
        const items = menus?.[0]?.items ?? [];
        const mapped = items.map((item: MenuItemApi): MenuItem => ({
          id: item.id.toString(),
          name: item.name,
          price: Number(item.price),
          description: item.description || '',
          image: item.image || `https://picsum.photos/seed/menu-${item.id}/400`,
        }));
        if (!isMounted) return;
        setMenuItems(mapped);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load menu items');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadMenu();
    return () => {
      isMounted = false;
    };
  }, [kitchens]);

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-900 sticky top-0 bg-[#0f0f0f] z-40">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Master Menu</h1>
        </div>
        <button className="p-2 bg-orange-600 rounded-xl text-white shadow-lg shadow-orange-600/20 active:scale-95 transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Search & Filter */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              type="text" 
              placeholder="Find a dish..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none"
            />
          </div>
          <button className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500">
            <Filter size={20} />
          </button>
        </div>

        {/* Categories (Tabs) */}
        <div className="flex space-x-3 overflow-x-auto no-scrollbar py-1">
          {['All Items', 'Best Sellers', 'Breakfast', 'Dinner', 'Drinks'].map((cat, idx) => (
            <button 
              key={cat}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                idx === 0 ? 'bg-orange-600 border-orange-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items List */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading && (
            <div className="text-sm text-zinc-500">Loading menu items...</div>
          )}
          {error && (
            <div className="text-sm text-red-400">{error}</div>
          )}
          {!isLoading && !error && menuItems.length === 0 && (
            <div className="text-sm text-zinc-500">No menu items yet.</div>
          )}
          {menuItems.map((item) => (
            <div key={item.id} className="bg-[#181818] border border-zinc-800 rounded-[32px] p-4 flex items-center space-x-4 group transition-all hover:bg-zinc-800/40">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-800 relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] font-black uppercase text-orange-500">
                  ₦{item.price.toLocaleString()}
                </div>
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-white">{item.name}</h3>
                  <div className="flex space-x-2">
                    <button className="text-zinc-600 hover:text-white transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => setMenuItems(prev => prev.filter(i => i.id !== item.id))}
                      className="text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 line-clamp-2 italic">{item.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-[10px] font-bold text-zinc-500">Available</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-orange-600/10 px-2 py-0.5 rounded-md">
                    <span className="text-[10px] font-black text-orange-500 uppercase">Stock: 45</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
