import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { ChevronLeft, Star, Clock, MapPin, Check, Plus, MessageCircle, ShoppingCart } from 'lucide-react';
import { menuAPI, MenuItemApi } from '../services/api';
import { MenuItem } from '../types';

const KitchenProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { kitchens, followingIds, toggleFollow, addToCart, cart } = useApp();
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'about'>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuError, setMenuError] = useState<string | null>(null);

  const kitchen = kitchens.find(k => k.id === id);

  useEffect(() => {
    let isMounted = true;
    const loadMenu = async () => {
      if (!id) return;
      setMenuError(null);
      try {
        const menus = await menuAPI.getByKitchen(id);
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
        setMenuError(err instanceof Error ? err.message : 'Failed to load menu');
      }
    };
    loadMenu();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!kitchen) return null;

  return (
    <div className="animate-in fade-in slide-in-from-right-10 duration-500">
      {/* Cover & Header */}
      <div className="relative h-64 overflow-hidden">
        <img src={kitchen.coverImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0f0f0f]"></div>
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <button 
            onClick={() => navigate('/')} 
            className="bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10 hover:bg-black/60 transition-colors active:scale-90"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          
          <button 
            onClick={() => navigate('/cart')}
            className="relative bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10 hover:bg-black/60 transition-colors active:scale-90"
          >
            <ShoppingCart size={20} className="text-white" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-bold border border-white/20">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Kitchen Info */}
      <div className="px-5 -mt-12 relative z-10">
        <div className="flex justify-between items-end">
          <div className="w-24 h-24 rounded-3xl border-4 border-[#0f0f0f] overflow-hidden shadow-2xl">
            <img src={kitchen.avatar} alt={kitchen.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex space-x-2 mb-2">
            <button 
              onClick={() => toggleFollow(kitchen.id)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                followingIds.has(kitchen.id) 
                  ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' 
                  : 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              }`}
            >
              {followingIds.has(kitchen.id) ? (
                <>
                  <Check size={16} />
                  <span>Following</span>
                </>
              ) : (
                <span>Follow</span>
              )}
            </button>
            <button className="p-2.5 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 transition-colors">
              <MessageCircle size={20} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-black">{kitchen.name}</h1>
          <div className="flex items-center space-x-4 mt-2 text-zinc-500 text-sm">
            <div className="flex items-center space-x-1">
              <Star size={14} className="text-orange-500 fill-orange-500" />
              <span className="font-bold text-white">{kitchen.rating}</span>
              <span className="text-[10px] text-zinc-600 font-medium ml-1">Reviews (128+)</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>25-40 min</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin size={14} />
              <span>2.4 km</span>
            </div>
          </div>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
            Authentic home-cooked meals prepared with love and organic spices. Fresh every day from {kitchen.ownerName}'s kitchen.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex border-b border-zinc-800">
          {(['menu', 'reviews', 'about'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-4 text-sm font-bold transition-all capitalize ${
                activeTab === tab ? 'text-orange-500 border-b-2 border-orange-500' : 'text-zinc-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content: Menu */}
        {activeTab === 'menu' && (
          <div className="mt-6 space-y-8 pb-10">
            {/* Today's Special Section */}
            {menuItems.length > 0 ? (
              <div className="bg-orange-600/10 border border-orange-600/20 p-4 rounded-3xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-600/20 blur-3xl rounded-full"></div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-orange-500 italic uppercase tracking-wider text-xs">Today's Special</h3>
                  <div className="bg-orange-600 text-[10px] font-black px-2 py-1 rounded-lg animate-pulse">
                    ENDS IN 02:45:12
                  </div>
                </div>
                <div className="flex space-x-4">
                  <img src={menuItems[0].image} alt="" className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{menuItems[0].name}</h4>
                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2">{menuItems[0].description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-black text-lg text-white">₦{menuItems[0].price.toLocaleString()}</span>
                      <button 
                        onClick={() => addToCart({ ...menuItems[0], quantity: 1, kitchenId: kitchen.id })}
                        className="bg-orange-600 p-2 rounded-xl text-white shadow-lg shadow-orange-600/20 active:scale-90 transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-3xl text-sm text-zinc-400">
                {menuError || 'No menu items available for this kitchen yet.'}
              </div>
            )}

            {/* Main Menu List */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg">Main Menu</h3>
              {menuItems.length === 0 && (
                <div className="text-sm text-zinc-500">{menuError || 'No menu items available.'}</div>
              )}
              {menuItems.map(item => (
                <div key={item.id} className="flex items-center space-x-4 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-800 border border-zinc-700">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-sm text-orange-500">₦{item.price.toLocaleString()}</span>
                      <button 
                        onClick={() => addToCart({ ...item, quantity: 1, kitchenId: kitchen.id })}
                        className="flex items-center space-x-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <Plus size={14} className="text-white" />
                        <span className="text-[11px] font-bold text-white">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'menu' && (
          <div className="py-20 text-center space-y-3 opacity-40">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-3xl flex items-center justify-center">
                <MessageCircle size={24} className="text-zinc-600" />
              </div>
            </div>
            <p className="text-sm font-medium">Coming soon to ChopNextDoor</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenProfile;
