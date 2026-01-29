
import React from 'react';
import { Home, Search, Heart, ShoppingBag, User, LayoutDashboard, UtensilsCrossed, ListOrdered, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../store/AppContext';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useApp();

  const customerItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Heart, label: 'Following', path: '/following' },
    { icon: ShoppingBag, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const sellerItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ListOrdered, label: 'Orders', path: '/seller/orders' },
    { icon: Users, label: 'Followers', path: '/seller/followers' },
    { icon: UtensilsCrossed, label: 'Menu', path: '/seller/menu' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const navItems = userRole === 'customer' ? customerItems : sellerItems;

  // Don't show on Story Viewer
  if (location.pathname.startsWith('/story')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#181818] border-t border-zinc-800 px-4 py-3 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center space-y-1 transition-colors min-w-[64px] ${
              isActive ? 'text-orange-500' : 'text-zinc-500'
            }`}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
