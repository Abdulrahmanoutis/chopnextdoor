
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Kitchen, CartItem, MenuItem } from '../types';
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kitchens] = useState<Kitchen[]>(MOCK_KITCHENS);
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

  const login = (role: 'customer' | 'seller') => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setCart([]);
  };

  const toggleFollow = useCallback((id: string) => {
    setFollowingIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
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
