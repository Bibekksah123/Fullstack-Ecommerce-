import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import SearchResults from './pages/SearchResults';
import CategoryPage from './pages/CategoryPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import TrackOrder from './pages/TrackOrder';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// User Account
import Profile from './pages/user/Profile';
import MyOrders from './pages/user/MyOrders';
import Wishlist from './pages/user/Wishlist';
import Addresses from './pages/user/Addresses';

// Seller Central
import SellerRegister from './pages/seller/SellerRegister';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerAnalytics from './pages/seller/SellerAnalytics';

import useAuth from './hooks/useAuth';

// Route Guards
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/auth/login" state={{ from: location }} replace />;
};

const SellerRoute = ({ children }) => {
  const { isAuthenticated, isSeller } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  return isSeller ? children : <Navigate to="/" replace />;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-950 text-dark-900 dark:text-dark-100 transition-colors duration-200">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-dark-800 dark:text-white dark:border dark:border-dark-700 rounded-2xl font-sans text-sm font-semibold',
          duration: 3500,
        }}
      />

      {/* Global Navbar */}
      <Navbar />

      {/* Main content body */}
      <main className="flex-1 pb-16">
        <Routes>
          {/* Public Shop Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />

          {/* Auth Guest Routes */}
          <Route path="/auth/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/auth/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/auth/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/auth/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />

          {/* Protected Customer Routes */}
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/order/:id/success" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />
          <Route path="/orders/:id/track" element={<PrivateRoute><TrackOrder /></PrivateRoute>} />
          <Route path="/account/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/account/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
          <Route path="/account/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          <Route path="/account/addresses" element={<PrivateRoute><Addresses /></PrivateRoute>} />
          <Route path="/seller/register" element={<PrivateRoute><SellerRegister /></PrivateRoute>} />

          {/* Protected Seller Routes */}
          <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
          <Route path="/seller/products" element={<SellerRoute><SellerProducts /></SellerRoute>} />
          <Route path="/seller/orders" element={<SellerRoute><SellerOrders /></SellerRoute>} />
          <Route path="/seller/analytics" element={<SellerRoute><SellerAnalytics /></SellerRoute>} />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;
