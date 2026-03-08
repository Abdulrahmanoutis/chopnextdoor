
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import HomeScreen from './screens/HomeScreen';
import StoryViewer from './screens/StoryViewer';
import KitchenProfile from './screens/KitchenProfile';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderConfirmation from './screens/OrderConfirmation';
import OrdersScreen from './screens/OrdersScreen';
import FollowingScreen from './screens/FollowingScreen';
import SearchScreen from './screens/SearchScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import BecomeSellerScreen from './screens/BecomeSellerScreen';
import SellerDashboard from './screens/seller/SellerDashboard';
import CreateMenuScreen from './screens/seller/CreateMenuScreen';
import MenuManagement from './screens/seller/MenuManagement';
import OrderManagement from './screens/seller/OrderManagement';
import FollowersScreen from './screens/seller/FollowersScreen';
import SellerProfile from './screens/seller/SellerProfile';
import { ProfilePlaceholder } from './screens/PlaceholderScreens';
import BottomNav from './components/BottomNav';

const AppContent: React.FC = () => {
  const { isAuthenticated, userRole } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) return;

    if (userRole === 'customer' && location.pathname.startsWith('/seller')) {
      navigate('/');
      return;
    }

    if (userRole === 'seller') {
      const allowedSellerPaths = ['/', '/profile'];
      const isSellerPath = location.pathname.startsWith('/seller');
      if (!isSellerPath && !allowedSellerPaths.includes(location.pathname)) {
        navigate('/seller/dashboard');
      }
    }
  }, [isAuthenticated, userRole, location.pathname, navigate]);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/auth/login" element={<LoginScreen />} />
        <Route path="/auth/register/:role" element={<RegisterScreen />} />
        <Route path="/auth/register" element={<Navigate to="/auth/register/customer" replace />} />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-20 max-w-lg mx-auto border-x border-zinc-800 shadow-2xl relative overflow-hidden">
      <Routes>
        {/* Customer Routes */}
        {userRole === 'customer' ? (
          <>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/story/:kitchenId/:storyIndex" element={<StoryViewer />} />
            <Route path="/kitchen/:id" element={<KitchenProfile />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/checkout" element={<CheckoutScreen />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/orders" element={<OrdersScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/following" element={<FollowingScreen />} />
            <Route path="/profile" element={<ProfilePlaceholder />} />
            <Route path="/become-seller" element={<BecomeSellerScreen />} />
          </>
        ) : (
          /* Seller Routes */
          <>
            <Route path="/" element={<SellerDashboard />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/create-menu" element={<CreateMenuScreen />} />
            <Route path="/seller/menu" element={<MenuManagement />} />
            <Route path="/seller/orders" element={<OrderManagement />} />
            <Route path="/seller/followers" element={<FollowersScreen />} />
            <Route path="/profile" element={<SellerProfile />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <BottomNav />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
