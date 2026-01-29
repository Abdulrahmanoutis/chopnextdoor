import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { ChevronLeft, Trash2, Plus, Minus, AlertCircle, Clock } from 'lucide-react';

const CartScreen: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart } = useApp();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-zinc-700" />
        </div>
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Looks like you haven't added anything to your cart yet. Head back to explore home kitchens!</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold w-full shadow-lg shadow-orange-600/20"
        >
          Explore Kitchens
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right-10 duration-500 pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-[#0f0f0f] z-40 p-4 border-b border-zinc-900">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Shopping Cart</h1>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="mx-4 mt-6 bg-orange-600/10 border border-orange-600/20 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3 text-orange-500">
          <Clock size={20} className="animate-pulse" />
          <span className="text-sm font-bold uppercase tracking-wider italic">Pre-order ends in</span>
        </div>
        <div className="text-lg font-black font-mono text-white">02:15:08</div>
      </div>

      {/* Cart Items List */}
      <div className="px-4 mt-8 space-y-6">
        {cart.map((item) => (
          <div key={item.id} className="flex space-x-4 bg-[#181818] p-4 rounded-2xl border border-zinc-800 group transition-all hover:border-zinc-700">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-white line-clamp-1">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center space-x-1.5 mt-1 text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md w-fit">
                  <AlertCircle size={10} />
                  <span>Limited Stock: 5 left</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="font-black text-white text-base">₦{item.price.toLocaleString()}</span>
                <div className="flex items-center space-x-3 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
                  <button 
                    onClick={() => updateCartQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 active:scale-90 transition-all"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-600 text-white shadow-lg shadow-orange-600/10 active:scale-90 transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#181818] border-t border-zinc-800 p-6 z-[60] pb-24">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Subtotal</span>
            <span className="text-2xl font-black text-white">₦{subtotal.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl shadow-orange-600/30 transform active:scale-[0.98] transition-all"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
