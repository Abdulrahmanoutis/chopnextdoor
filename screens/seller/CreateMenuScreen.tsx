
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Plus, Trash2, Clock, Send, Eye } from 'lucide-react';
import { menuAPI } from '../../services/api';
import { useApp } from '../../store/AppContext';

type Slide = {
  id: string;
  foodName: string;
  price: string;
  image: string;
  imageFile?: File | null;
};

const CreateMenuScreen: React.FC = () => {
  const navigate = useNavigate();
  const { kitchens } = useApp();
  const [isActive, setIsActive] = useState(true);
  const [closeTime, setCloseTime] = useState('02:00 PM');
  const [slides, setSlides] = useState<Slide[]>([
    { id: '1', foodName: '', price: '', image: 'https://picsum.photos/seed/masa_story/600/1000' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      foodName: '',
      price: '',
      image: 'https://picsum.photos/seed/newdish/600/1000'
    };
    setSlides([...slides, newSlide]);
  };

  const removeSlide = (id: string) => {
    setSlides(slides.filter(s => s.id !== id));
  };

  return (
    <div className="animate-in slide-in-from-right-10 duration-500 pb-10">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-900 sticky top-0 bg-[#0f0f0f] z-40">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Today's Menu</h1>
        </div>
        <button className="p-2 bg-zinc-900 rounded-xl text-zinc-500">
          <Eye size={20} />
        </button>
      </div>

      <div className="p-5 space-y-8">
        {/* Status Toggle */}
        <div className="bg-[#181818] border border-zinc-800 p-6 rounded-[32px] flex items-center justify-between">
          <div>
            <h3 className="font-black italic tracking-tighter text-lg uppercase">KITCHEN STATUS</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Toggle visibility to customers</p>
          </div>
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-16 h-8 rounded-full transition-all relative ${isActive ? 'bg-orange-600' : 'bg-zinc-800'}`}
          >
            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${isActive ? 'left-9' : 'left-1'}`}></div>
          </button>
        </div>

        {/* Time Config */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">Pre-order Closing Time</h2>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
            <select 
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none appearance-none font-bold"
            >
              {['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Story Builder */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">Story Slides</h2>
            <span className="text-[10px] font-bold text-zinc-700">{slides.length}/5 slides</span>
          </div>

          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div key={slide.id} className="relative aspect-[9/16] rounded-[40px] overflow-hidden group shadow-2xl">
                <img src={slide.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
                
                {/* Editable Overlay */}
                <div className="absolute inset-x-6 bottom-8 space-y-3">
                  <input 
                    type="text" 
                    defaultValue={slide.foodName}
                    placeholder="Dish Name"
                    className="w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xl font-black italic tracking-tighter text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                    onChange={(e) => {
                      const value = e.target.value;
                      setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, foodName: value } : s));
                    }}
                  />
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-orange-500 text-lg">₦</span>
                    <input 
                      type="number" 
                      defaultValue={slide.price}
                      placeholder="Price"
                      className="w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 pl-10 text-lg font-black text-white focus:outline-none focus:border-orange-500"
                      onChange={(e) => {
                        const value = e.target.value;
                        setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, price: value } : s));
                      }}
                    />
                  </div>
                </div>

                <div className="absolute top-6 right-6 flex flex-col space-y-3">
                  <button onClick={() => removeSlide(slide.id)} className="p-3 bg-red-500 text-white rounded-2xl shadow-xl active:scale-90 transition-all">
                    <Trash2 size={20} />
                  </button>
                  <label className="p-3 bg-white text-black rounded-2xl shadow-xl active:scale-90 transition-all cursor-pointer">
                    <Camera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const preview = URL.createObjectURL(file);
                        setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, imageFile: file, image: preview } : s));
                      }}
                    />
                  </label>
                </div>
                
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-full font-black text-[10px] italic">
                  SLIDE {index + 1}
                </div>
              </div>
            ))}

            <button 
              onClick={addSlide}
              className="w-full h-32 border-2 border-dashed border-zinc-800 rounded-[40px] flex flex-col items-center justify-center space-y-2 text-zinc-600 hover:text-orange-500 hover:border-orange-500/30 transition-all"
            >
              <Plus size={32} />
              <span className="text-xs font-black uppercase tracking-widest">Add Story Slide</span>
            </button>
          </div>
        </div>

        {/* Publish Button */}
        <div className="sticky bottom-4 z-50 px-2 pt-10">
          <button 
            onClick={async () => {
              setError(null);
              setIsSubmitting(true);
              try {
                const kitchenId = kitchens[0]?.id;
                if (!kitchenId) {
                  throw new Error('No kitchen found for this seller');
                }

                const now = new Date();
                const expires = new Date(now);
                const [time, period] = closeTime.split(' ');
                const [hourStr, minuteStr] = time.split(':');
                let hour = parseInt(hourStr, 10);
                const minute = parseInt(minuteStr, 10);
                if (period === 'PM' && hour < 12) hour += 12;
                if (period === 'AM' && hour === 12) hour = 0;
                expires.setHours(hour, minute, 0, 0);
                if (expires <= now) {
                  expires.setDate(expires.getDate() + 1);
                }

                const menu = await menuAPI.createMenu({
                  kitchen: parseInt(kitchenId, 10),
                  expires_at: expires.toISOString(),
                  is_active: isActive,
                });

                for (const slide of slides) {
                  const price = Number(slide.price);
                  if (!slide.foodName || Number.isNaN(price)) continue;
                  await menuAPI.addMenuItem({
                    today_menu: menu.id,
                    name: slide.foodName,
                    description: '',
                    price,
                    stock: 20,
                    is_available: true,
                    image: slide.imageFile || null,
                  });
                }

                alert('Menu Published Successfully!');
                navigate('/seller/dashboard');
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to publish menu');
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
            className="w-full bg-white text-black py-5 rounded-[32px] font-black text-base flex items-center justify-center space-x-3 shadow-2xl hover:bg-orange-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send size={20} />
            <span>{isSubmitting ? 'Publishing...' : 'Publish to Followers'}</span>
          </button>
          {error && (
            <div className="mt-4 text-center text-sm text-red-400">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMenuScreen;
