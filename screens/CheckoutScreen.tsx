import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { ChevronLeft, MapPin, Truck, ShoppingBag, CreditCard, Wallet, ChevronRight, Clock } from 'lucide-react';
import { menuAPI, orderAPI } from '../services/api';

const CheckoutScreen: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useApp();
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [payment, setPayment] = useState<'online' | 'cash'>('online');
  const [time, setTime] = useState('12:30 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = method === 'delivery' ? 1200 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const kitchenId = cart[0].kitchenId;
      const kitchenIdNumber = parseInt(kitchenId, 10);
      if (Number.isNaN(kitchenIdNumber)) {
        throw new Error('Please refresh the app and add items again to use live menus.');
      }
      const menus = await menuAPI.getByKitchen(kitchenId);
      if (!menus || menus.length === 0) {
        throw new Error('No active menu found for this kitchen');
      }
      const menu = menus[0];
      const pickupTime = new Date();
      pickupTime.setHours(pickupTime.getHours() + 1);

      const orderResponse = await orderAPI.create({
        kitchen: kitchenIdNumber,
        today_menu: menu.id,
        total_amount: total,
        pickup_time: pickupTime.toISOString(),
        delivery_address: method === 'delivery' ? '42 Home Cooked Lane, Victoria Island' : '',
        is_delivery: method === 'delivery',
        payment_method: payment === 'online' ? 'ONLINE' : 'CASH',
        payment_status: false,
      });

      const orderId = orderResponse?.id;
      if (orderId) {
        for (const item of cart) {
          const menuItemId = parseInt(item.id, 10);
          if (Number.isNaN(menuItemId)) continue;
          await orderAPI.addItem(orderId, {
            menu_item: menuItemId,
            quantity: item.quantity,
            price_at_time: item.price,
          });
        }
      }

      clearCart();
      navigate('/order-confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-10 duration-500 pb-10">
      {/* Header */}
      <div className="p-4 flex items-center space-x-4 border-b border-zinc-900 sticky top-0 bg-[#0f0f0f] z-40">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Checkout</h1>
      </div>

      <div className="p-5 space-y-8">
        {/* Fulfillment Method */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">How would you like your food?</h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setMethod('delivery')}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${
                  method === 'delivery' ? 'bg-orange-600/10 border-orange-600 text-orange-500' : 'bg-[#181818] border-zinc-800 text-zinc-500'
                }`}
            >
              <Truck size={28} className="mb-2" />
              <span className="text-sm font-bold">Delivery</span>
            </button>
            <button 
              onClick={() => setMethod('pickup')}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${
                method === 'pickup' ? 'bg-orange-600/10 border-orange-600 text-orange-500' : 'bg-[#181818] border-zinc-800 text-zinc-500'
              }`}
            >
              <ShoppingBag size={28} className="mb-2" />
              <span className="text-sm font-bold">Pickup</span>
            </button>
          </div>
        </div>

        {/* Address or Location Section */}
        <div className="bg-[#181818] p-5 rounded-3xl border border-zinc-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm">{method === 'delivery' ? 'Delivery Address' : 'Pickup Location'}</h3>
            <button className="text-orange-500 text-xs font-bold">Edit</button>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-zinc-800 rounded-lg">
              <MapPin size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">42 Home Cooked Lane, Victoria Island</p>
              <p className="text-xs text-zinc-500 mt-1">Lagos, Nigeria</p>
            </div>
          </div>
        </div>

        {/* Pickup/Delivery Time */}
        <div className="bg-[#181818] p-5 rounded-3xl border border-zinc-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm">Schedule Time</h3>
            <Clock size={18} className="text-zinc-500" />
          </div>
          <div className="flex overflow-x-auto space-x-3 no-scrollbar pb-1">
            {['12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM'].map(t => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  time === t ? 'bg-orange-600 border-orange-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Payment Method</h2>
          <div className="space-y-3">
            <button 
              onClick={() => setPayment('online')}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                payment === 'online' ? 'bg-orange-600/5 border-orange-600 text-white' : 'bg-[#181818] border-zinc-800 text-zinc-500'
              }`}
            >
              <div className="flex items-center space-x-4">
                <CreditCard size={22} className={payment === 'online' ? 'text-orange-500' : 'text-zinc-600'} />
                <span className="font-bold text-sm text-inherit">Pay Now (Online)</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === 'online' ? 'border-orange-500 bg-orange-500' : 'border-zinc-700'}`}>
                {payment === 'online' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </button>
            <button 
              onClick={() => setPayment('cash')}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                payment === 'cash' ? 'bg-orange-600/5 border-orange-600 text-white' : 'bg-[#181818] border-zinc-800 text-zinc-500'
              }`}
            >
              <div className="flex items-center space-x-4">
                <Wallet size={22} className={payment === 'cash' ? 'text-orange-500' : 'text-zinc-600'} />
                <span className="font-bold text-sm text-inherit">Pay on {method === 'pickup' ? 'Pickup' : 'Delivery'}</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === 'cash' ? 'border-orange-500 bg-orange-500' : 'border-zinc-700'}`}>
                {payment === 'cash' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Items Subtotal</span>
            <span className="font-bold">₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Delivery Fee</span>
            <span className="font-bold">₦{deliveryFee.toLocaleString()}</span>
          </div>
          <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
            <span className="text-lg font-black italic tracking-tighter">TOTAL AMOUNT</span>
            <span className="text-2xl font-black text-orange-500 tracking-tighter">₦{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button 
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-orange-600/40 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
        {error && (
          <div className="text-center text-sm text-red-400">{error}</div>
        )}
      </div>
    </div>
  );
};

export default CheckoutScreen;
