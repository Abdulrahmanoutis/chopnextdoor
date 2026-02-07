
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Kitchen, CartItem, MenuItem } from '../types';
import { clearAuthToken, kitchenAPI, KitchenApi } from '../services/api';
import { MOCK_KITCHENS } from '../data/mockData';

interface AppContextType {
  kitchens: Kitchen[];
  followingIds: Set<string>;
  cart: CartItem[];
  toggleFollow: (id: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  userRole: 'customer' | 'seller';
  setUserRole: (role: 'customer' | 'seller') => void;
  isAuthenticated: boolean;
  login: (role: 'customer' | 'seller') => void;
  logout: () => void;
  sellerMenu: MenuItem[];
  addSellerMenuItem: (item: MenuItem) => void;
  updateSellerMenuItem: (item: MenuItem) => void;
  deleteSellerMenuItem: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mapApiKitchenToUi = (apiKitchen: KitchenApi, fallback?: Kitchen): Kitchen => {
  const fallbackId = fallback?.id ?? apiKitchen.id.toString();
  return {
    id: apiKitchen.id.toString(),
    name: apiKitchen.name || fallback?.name || 'Kitchen',
    ownerName: fallback?.ownerName || 'Kitchen',
    avatar: apiKitchen.logo || fallback?.avatar || `https://picsum.photos/seed/${fallbackId}/200`,
    coverImage:
      apiKitchen.cover_image || fallback?.coverImage || `https://picsum.photos/seed/${fallbackId}-cover/800/400`,
    rating: apiKitchen.rating ?? fallback?.rating ?? 0,
    tags: fallback?.tags ?? [],
    isLive: apiKitchen.is_active ?? false,
    isFollowing: apiKitchen.is_following ?? false,
    menu: fallback?.menu ?? [],
    stories: fallback?.stories ?? [],
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kitchens, setKitchens] = useState<Kitchen[]>(MOCK_KITCHENS);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set(['k1']));
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Persisted state
  const [userRole, setUserRole] = useState<'customer' | 'seller'>(
    (localStorage.getItem('userRole') as 'customer' | 'seller') || 'customer'
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  
  // Seller State
  const [sellerMenu, setSellerMenu] = useState<MenuItem[]>(MOCK_KITCHENS[0].menu);

  useEffect(() => {
    let isMounted = true;
    const loadKitchens = async () => {
      try {
        const apiKitchens = await kitchenAPI.getAll();
        const mapped = apiKitchens.map((k, idx) => mapApiKitchenToUi(k, MOCK_KITCHENS[idx]));
        if (!isMounted) return;
        setKitchens(mapped);
        setFollowingIds(new Set(mapped.filter(k => k.isFollowing).map(k => k.id)));
      } catch (err) {
        console.error('Failed to load kitchens from API', err);
      }
    };

    loadKitchens();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = (role: 'customer' | 'seller') => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    clearAuthToken();
    setIsAuthenticated(false);
    setCart([]);
  };

  const toggleFollow = useCallback(async (id: string) => {
    try {
      const result = await kitchenAPI.follow(id);
      const isNowFollowing = result.status === 'followed';
      setFollowingIds(prev => {
        const newSet = new Set(prev);
        if (isNowFollowing) newSet.add(id);
        else newSet.delete(id);
        return newSet;
      });
      setKitchens(prev =>
        prev.map(k => (k.id === id ? { ...k, isFollowing: isNowFollowing } : k))
      );
    } catch (err) {
      console.error('Failed to toggle follow', err);
    }
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateCartQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const addSellerMenuItem = (item: MenuItem) => setSellerMenu(prev => [...prev, item]);
  const updateSellerMenuItem = (item: MenuItem) => setSellerMenu(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteSellerMenuItem = (id: string) => setSellerMenu(prev => prev.filter(i => i.id !== id));

  return (
    <AppContext.Provider value={{ 
      kitchens, 
      followingIds, 
      cart, 
      toggleFollow, 
      addToCart, 
      removeFromCart,
      updateCartQuantity,
      clearCart,
      userRole,
      setUserRole,
      isAuthenticated,
      login,
      logout,
      sellerMenu,
      addSellerMenuItem,
      updateSellerMenuItem,
      deleteSellerMenuItem
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
