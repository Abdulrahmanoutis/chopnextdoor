import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const StoryViewer: React.FC = () => {
  const { kitchenId, storyIndex } = useParams();
  const navigate = useNavigate();
  const { kitchens } = useApp();
  
  const currentKitchen = kitchens.find(k => k.id === kitchenId);
  const index = parseInt(storyIndex || '0');
  const [progress, setProgress] = useState(0);

  const currentStory = currentKitchen?.stories[index];

  useEffect(() => {
    if (!currentStory) {
      navigate('/');
      return;
    }

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          if (index < (currentKitchen?.stories.length || 0) - 1) {
            navigate(`/story/${kitchenId}/${index + 1}`);
            return 0;
          } else {
            navigate('/');
            return 100;
          }
        }
        return p + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStory, index, kitchenId, currentKitchen?.stories.length, navigate]);

  if (!currentStory || !currentKitchen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black max-w-lg mx-auto overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={currentStory.image} alt="Food" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
      </div>

      {/* Controls Container */}
      <div className="relative flex-1 p-4 flex flex-col justify-between">
        {/* Top Part */}
        <div className="space-y-4">
          {/* Progress Bars */}
          <div className="flex space-x-1.5">
            {currentKitchen.stories.map((_, i) => (
              <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{ 
                    width: i < index ? '100%' : i === index ? `${progress}%` : '0%' 
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={currentKitchen.avatar} alt="" className="w-10 h-10 rounded-full border border-white/40 p-0.5" />
              <div>
                <h4 className="font-bold text-sm text-white drop-shadow-md">{currentKitchen.name}</h4>
                <div className="flex items-center space-x-1 text-[10px] text-white/70 font-medium">
                  <Clock size={10} />
                  <span>{currentStory.timestamp}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/')} 
              className="bg-black/20 backdrop-blur-sm p-2 rounded-full hover:bg-black/40 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Middle Content */}
        <div className="flex-1 flex items-center justify-between pointer-events-none">
          <button 
            className="w-20 h-full pointer-events-auto" 
            onClick={() => index > 0 && navigate(`/story/${kitchenId}/${index - 1}`)}
          />
          <button 
            className="w-20 h-full pointer-events-auto" 
            onClick={() => index < currentKitchen.stories.length - 1 ? navigate(`/story/${kitchenId}/${index + 1}`) : navigate('/')}
          />
        </div>

        {/* Bottom Part */}
        <div className="space-y-6 pb-8 text-center">
          <div className="space-y-1">
            <h2 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-2xl">
              {currentStory.foodName.toUpperCase()}
            </h2>
            <p className="text-orange-400 font-bold tracking-widest text-xs uppercase animate-pulse">
              Available Now • Freshly Made
            </p>
          </div>
          
          <button 
            onClick={() => navigate(`/kitchen/${kitchenId}`)}
            className="bg-orange-600 text-white w-full py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-orange-600/40 transform active:scale-95 transition-all"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
