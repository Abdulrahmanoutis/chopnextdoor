
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Clock, CheckCircle2, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { orderAPI, OrderApi } from '../../services/api';

type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed';

const OrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderStatus>('New');

  const [orders, setOrders] = useState<OrderApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadOrders = async () => {
      try {
        const data = await orderAPI.listSeller();
        if (!isMounted) return;
        setOrders(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const mapStatus = (status: string): OrderStatus => {
      if (status === 'READY') return 'Ready';
      if (status === 'PREPARING') return 'Preparing';
      if (status === 'COMPLETED' || status === 'CANCELLED') return 'Completed';
      return 'New';
  };

  const filteredOrders = useMemo(() => {
    return orders
      .map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        customer: order.customer_name || `Customer #${order.customer}`,
        items: (order.items || []).map(i => `${i.menu_item?.name ?? 'Item'} x ${i.quantity}`),
        total: order.total_amount,
        status: mapStatus(order.status),
        time: new Date(order.created_at).toLocaleString(),
        rawStatus: order.status,
      }))
      .filter(o => o.status === activeTab);
  }, [orders, activeTab]);

  const statusCounts = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      New: 0,
      Preparing: 0,
      Ready: 0,
      Completed: 0,
    };
    for (const order of orders) {
      counts[mapStatus(order.status)] += 1;
    }
    return counts;
  }, [orders]);

  const updateStatus = async (id: number, currentStatus: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      New: 'PREPARING',
      Preparing: 'READY',
      Ready: 'COMPLETED',
      Completed: 'COMPLETED',
    };
    const next = statusMap[currentStatus] || 'COMPLETED';
    try {
      await orderAPI.updateStatus(id, next);
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: next } : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
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
          {orders.filter(o => mapStatus(o.status) !== 'Completed').length} Active
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-900 bg-[#0f0f0f] sticky top-[65px] z-30">
        {(['New', 'Preparing', 'Ready', 'Completed'] as OrderStatus[]).map(tab => {
          const count = statusCounts[tab];
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
        {isLoading && (
          <div className="py-10 text-center text-zinc-500">Loading orders...</div>
        )}
        {error && (
          <div className="py-4 text-center text-red-400">{error}</div>
        )}
        {!isLoading && filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-[#181818] border border-zinc-800 rounded-[32px] p-5 space-y-4 group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black italic text-white tracking-tighter">#{order.orderNumber}</span>
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
                  onClick={() => updateStatus(order.id, order.status as OrderStatus)}
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
