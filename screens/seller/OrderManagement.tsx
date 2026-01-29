
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Clock, CheckCircle2, Phone, MessageCircle, ArrowRight } from 'lucide-react';

type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed';

const OrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderStatus>('New');

  const [orders, setOrders] = useState([
    { id: '1277', customer: 'James Obi', items: ['Masa x 2', 'Zobo x 1'], total: 5800, status: 'New', time: '5m ago' },
    { id: '1278', customer: 'Sarah Ken', items: ['Grilled Chicken x 1'], total: 5500, status: 'New', time: '12m ago' },
    { id: '1279', customer: 'Femi Ade', items: ['Tuwo x 1', 'Zobo x 2'], total: 4600, status: 'Preparing', time: '20m ago' },
    { id: '1280', customer: 'Amaka V.', items: ['Masa x 4'], total: 10000, status: 'Ready', time: '45m ago' },
    { id: '1270', customer: 'David O.', items: ['Grilled Chicken x 2'], total: 11000, status: 'Completed', time: '2h ago' },
  ]);

  const filteredOrders = orders.filter(o => o.status === activeTab);

  const updateStatus = (id: string, nextStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
  };

  const getNextAction = (status: OrderStatus) => {
    switch (status) {
      case 'New': return 'Start Preparing';
      case 'Preparing': return 'Mark Ready';
      case 'Ready': return 'Complete Order';
      default: return null;
    }
  };

  const getNextStatus = (status: OrderStatus): OrderStatus => {
    switch (status) {
      case 'New': return 'Preparing';
      case 'Preparing': return 'Ready';
      case 'Ready': return 'Completed';
      default: return 'Completed';
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <div className="p-4 flex items-center justify-between border-b border-zinc-900 sticky top-0 bg-[#0f0f0f] z-40">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Manage Orders</h1>
        </div>
        <div className="bg-orange-600/10 text-orange-500 text-[10px] font-black px-2 py-1 rounded-lg uppercase">
          {orders.filter(o => o.status !== 'Completed').length} Active
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-900 bg-[#0f0f0f] sticky top-[65px] z-30">
        {(['New', 'Preparing', 'Ready', 'Completed'] as OrderStatus[]).map(tab => {
          const count = orders.filter(o => o.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-orange-500' : 'text-zinc-600'
              }`}
            >
              {tab} {count > 0 && <span className="ml-1 opacity-60">({count})</span>}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>}
            </button>
          );
        })}
      </div>

      <div className="p-5 space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-[#181818] border border-zinc-800 rounded-[32px] p-5 space-y-4 group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black italic text-white tracking-tighter">#{order.id}</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">• {order.time}</span>
                  </div>
                  <h3 className="font-bold text-sm text-zinc-300 mt-1">{order.customer}</h3>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2.5 bg-zinc-900 rounded-xl text-zinc-400 hover:text-white transition-colors">
                    <Phone size={16} />
                  </button>
                  <button className="p-2.5 bg-zinc-900 rounded-xl text-zinc-400 hover:text-white transition-colors">
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-400">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Total</span>
                  <span className="text-base font-black text-white">₦{order.total.toLocaleString()}</span>
                </div>
              </div>

              {activeTab !== 'Completed' && (
                <button 
                  onClick={() => updateStatus(order.id, getNextStatus(order.status as OrderStatus))}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-lg shadow-orange-600/10"
                >
                  <span>{getNextAction(order.status as OrderStatus)}</span>
                  <ArrowRight size={16} />
                </button>
              )}

              {activeTab === 'Completed' && (
                <div className="flex items-center justify-center space-x-2 text-green-500 bg-green-500/10 py-3 rounded-2xl border border-green-500/20">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">Delivered Successfully</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-24 text-center space-y-4 opacity-40">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center">
                <ShoppingBag size={32} className="text-zinc-600" />
              </div>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest">No {activeTab} orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
