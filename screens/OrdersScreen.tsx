import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { ChevronLeft, Package, Clock, ChevronRight, CheckCircle2, MessageCircle, Star } from 'lucide-react';

const OrdersScreen: React.FC = () => {
  const navigate = useNavigate();
  const { kitchens } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const activeOrders = [
    {
      id: '1276-CDN',
      kitchen: kitchens[0],
      status: 'Preparing', // Ordered, Preparing, Ready, Completed
      statusStep: 2, // 1: Ordered, 2: Preparing, 3: Ready
      time: '12:30 PM Today',
      itemsCount: 2,
      total: 3300
    },
    {
      id: '1280-CDN',
      kitchen: kitchens[1],
      status: 'Ordered',
      statusStep: 1,
      time: '1:45 PM Today',
      itemsCount: 1,
      total: 5500
    }
  ];

  const pastOrders = [
    {
      id: '0942-CDN',
      kitchen: kitchens[1],
      status: 'Delivered',
      time: 'Yesterday, 6:45 PM',
      itemsCount: 1,
      total: 5500
    }
  ];

  const renderStatusTimeline = (step: number) => {
    return (
      <div className="flex items-center space-x-2 mt-4">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`w-3 h-3 rounded-full ${s <= step ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-zinc-800'}`} />
            {s < 3 && <div className={`flex-1 h-0.5 rounded-full ${s < step ? 'bg-orange-500' : 'bg-zinc-800'}`} />}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const getStatusText = (step: number) => {
    switch(step) {
      case 1: return 'Ordered';
      case 2: return 'Preparing';
      case 3: return 'Ready';
      default: return 'Pending';
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <div className="p-4 space-y-4 border-b border-zinc-900 sticky top-0 bg-[#0f0f0f] z-40">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">My Orders</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800">
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'active' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            Active ({activeOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'past' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            Past Orders
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {activeTab === 'active' ? (
          <section className="space-y-4">
            {activeOrders.map(order => (
              <div key={order.id} className="bg-zinc-900/30 border border-zinc-800 rounded-[32px] p-6 space-y-5 group hover:border-orange-500/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <img src={order.kitchen.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border border-zinc-800" />
                    <div>
                      <h3 className="font-bold text-sm">{order.kitchen.name}</h3>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">#{order.id}</p>
                    </div>
                  </div>
                  <button className="p-2.5 bg-zinc-900 rounded-xl text-orange-500 border border-zinc-800 shadow-xl active:scale-90 transition-all">
                    <MessageCircle size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-zinc-500 px-1">
                    <span className={order.statusStep >= 1 ? 'text-orange-500' : ''}>Ordered</span>
                    <span className={order.statusStep >= 2 ? 'text-orange-500' : ''}>Preparing</span>
                    <span className={order.statusStep >= 3 ? 'text-orange-500' : ''}>Ready</span>
                  </div>
                  {renderStatusTimeline(order.statusStep)}
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-zinc-800/50">
                  <div className="flex items-center space-x-2 text-zinc-400">
                    <Clock size={14} />
                    <span className="text-xs font-bold">{order.time}</span>
                  </div>
                  <button className="text-orange-500 text-xs font-black uppercase flex items-center group-hover:translate-x-1 transition-transform tracking-widest">
                    Track <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
            
            {activeOrders.length === 0 && (
              <div className="py-20 text-center space-y-4 opacity-40">
                <Package size={48} className="mx-auto text-zinc-600" />
                <p className="text-sm font-medium">No active orders right now.</p>
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-4">
            {pastOrders.map(order => (
              <div key={order.id} className="bg-[#181818] border border-zinc-800 rounded-[32px] p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <img src={order.kitchen.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover opacity-60 grayscale" />
                    <div>
                      <h3 className="font-bold text-sm text-zinc-300">{order.kitchen.name}</h3>
                      <p className="text-[10px] text-zinc-600 font-bold mt-0.5">{order.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-green-500 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
                    <CheckCircle2 size={12} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Delivered</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{order.itemsCount} items • ₦{order.total.toLocaleString()}</p>
                  <div className="flex space-x-2">
                    <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all active:scale-95 uppercase">
                      Reorder
                    </button>
                    <button className="bg-orange-600/10 text-orange-500 border border-orange-600/30 text-[10px] font-black px-4 py-2 rounded-xl transition-all active:scale-95 uppercase flex items-center space-x-1">
                      <Star size={10} />
                      <span>Rate</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {pastOrders.length === 0 && (
              <div className="py-20 text-center space-y-4 opacity-40">
                <Package size={48} className="mx-auto text-zinc-600" />
                <p className="text-sm font-medium">No order history yet.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default OrdersScreen;
