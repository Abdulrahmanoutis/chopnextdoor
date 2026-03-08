
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Users, PlusCircle, List, ChevronRight, Bell } from 'lucide-react';
import { orderAPI, OrderApi, kitchenAPI, KitchenApi, resolveMediaUrl } from '../../services/api';

const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [kitchen, setKitchen] = useState<KitchenApi | null>(null);
  const [orders, setOrders] = useState<OrderApi[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [ordersData, kitchenData] = await Promise.all([
          orderAPI.listSeller(),
          kitchenAPI.getMine(),
        ]);
        if (!isMounted) return;
        setOrders(ordersData);
        setKitchen(kitchenData);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load seller data');
      }
    };

    loadData();
    const interval = setInterval(loadData, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const todayOrders = useMemo(() => {
    const today = new Date().toDateString();
    return orders.filter(o => new Date(o.created_at).toDateString() === today);
  }, [orders]);

  const earningsToday = useMemo(() => {
    return todayOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  }, [todayOrders]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  return (
    <div className="animate-in fade-in duration-500 p-5 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl border-2 border-orange-600/30 overflow-hidden shadow-xl">
            <img src={resolveMediaUrl(kitchen?.logo) || 'https://picsum.photos/seed/seller-default/200'} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-black">Hello, {kitchen?.name || 'Seller'}</h1>
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
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Today's Orders</span>
            <h2 className="text-2xl font-black">{todayOrders.length}</h2>
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
            <h2 className="text-2xl font-black">₦{earningsToday.toLocaleString()}</h2>
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
          <div className="w-12 h-12 rounded-2xl border-2 border-[#181818] bg-zinc-800 flex items-center justify-center">
            <Users size={18} className="text-zinc-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Followers</h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              {kitchen?.follower_count ?? 0} total followers
            </p>
          </div>
        </div>
        <button onClick={() => navigate('/seller/followers')} className="bg-zinc-800 px-4 py-2 rounded-xl text-xs font-bold text-white">View All</button>
      </div>

      {/* Recent Orders List */}
      <div className="space-y-4 pb-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Incoming Orders</h2>
          <button className="text-orange-500 text-[10px] font-bold uppercase">View All</button>
        </div>
        <div className="space-y-3">
          {error && (
            <div className="text-sm text-red-400">{error}</div>
          )}
          {recentOrders.length === 0 && !error && (
            <div className="text-sm text-zinc-500">No recent orders yet.</div>
          )}
          {recentOrders.map(order => {
            const itemsText = (order.items || [])
              .map(i => `${i.menu_item?.name ?? 'Item'} x ${i.quantity}`)
              .join(', ');
            return (
              <div key={order.id} className="bg-zinc-900/50 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-zinc-800">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center font-bold text-xs text-zinc-500">{order.order_number}</div>
                  <div>
                    <h4 className="font-bold text-sm">{order.customer_name || `Customer #${order.customer}`}</h4>
                    <p className="text-[10px] text-zinc-500">{itemsText || 'No items'}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-orange-500/60 italic">
                  {new Date(order.created_at).toLocaleTimeString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
