import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import DarkModeToggle from '../ui/DarkModeToggle';
import { useGetCategoriesQuery } from '../../features/products/productsApi';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const wishlistCount = wishlistItems?.length || 0;

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
    setCategoriesOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-800 transition-base">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-semibold py-1.5 px-4 text-center">
        <div className="flex justify-between max-w-7xl mx-auto items-center">
          <div className="hidden sm:block">Welcome to ShopNow! Shop premium products.</div>
          <div className="flex gap-4 mx-auto sm:mx-0">
            {user?.role === 'customer' && (
              <Link to="/seller/register" className="hover:underline flex items-center gap-1">
                <BuildingStorefrontIcon className="w-3.5 h-3.5" /> Become a Seller
              </Link>
            )}
            {user?.role === 'seller' && (
              <Link to="/seller/dashboard" className="hover:underline flex items-center gap-1 font-bold text-secondary-100">
                <BuildingStorefrontIcon className="w-3.5 h-3.5" /> Seller Central
              </Link>
            )}
            <Link to="/orders/track" className="hover:underline">Track My Order</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-display font-extrabold text-xl shadow-glow">
              S
            </span>
            <span className="font-display font-black text-2xl tracking-tight bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent group-hover:opacity-95 transition-opacity">
              ShopNow
            </span>
          </Link>

          {/* Category Dropdown Toggle (Desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-dark-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
            >
              <Squares2X2Icon className="w-5 h-5 text-primary-500" />
              Categories
            </button>

            {categoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-dark-800 rounded-2xl shadow-hover border border-gray-100 dark:border-dark-700 py-3 animate-scale-in z-50">
                {categories.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-400">No categories found</div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {cat.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg relative hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for items, categories, brands..."
                className="input pr-12 focus:ring-secondary-500"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-tr from-primary-500 to-secondary-500 text-white hover:opacity-90 active:scale-95 transition-all shadow-glow"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Icons/Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <DarkModeToggle />

            {/* Wishlist */}
            <Link
              to="/account/wishlist"
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 text-dark-600 dark:text-dark-300 transition-colors relative"
            >
              <HeartIcon className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-dark-900 shadow-sm animate-pulse-slow">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 text-dark-600 dark:text-dark-300 transition-colors relative"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-dark-900 shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile dropdown */}
            <div className="h-6 w-[1px] bg-gray-200 dark:bg-dark-700 mx-2" />

            {isAuthenticated ? (
              <div className="relative group">
                <Link
                  to="/account/profile"
                  className="flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors cursor-pointer"
                >
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/150'}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-500/30"
                  />
                  <div className="text-left">
                    <p className="text-xs text-dark-400 font-medium">Hello,</p>
                    <p className="text-sm font-bold text-dark-800 dark:text-dark-100 leading-tight">
                      {user?.name.split(' ')[0]}
                    </p>
                  </div>
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-dark-800 rounded-2xl shadow-hover border border-gray-100 dark:border-dark-700 py-2 hidden group-hover:block hover:block animate-scale-in z-50">
                  <Link
                    to="/account/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-dark-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <UserIcon className="w-4.5 h-4.5 text-primary-500" />
                    My Profile
                  </Link>
                  <Link
                    to="/account/orders"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-dark-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <ShoppingCartIcon className="w-4.5 h-4.5 text-secondary-500" />
                    My Orders
                  </Link>
                  {user?.role === 'seller' && (
                    <Link
                      to="/seller/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-dark-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                    >
                      <BuildingStorefrontIcon className="w-4.5 h-4.5 text-amber-500" />
                      Seller Central
                    </Link>
                  )}
                  <div className="border-t border-gray-100 dark:border-dark-750 my-1" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-left"
                  >
                    <ArrowRightOnRectangleIcon className="w-4.5 h-4.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/login" className="btn-ghost font-bold text-sm px-4 py-2">
                  Sign In
                </Link>
                <Link to="/auth/register" className="btn-primary py-2 text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Search toggles */}
          <div className="flex items-center gap-3 md:hidden">
            <DarkModeToggle />
            
            <Link to="/cart" className="relative p-2 text-dark-600 dark:text-dark-300">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-xl"
            >
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-dark-800 bg-white dark:bg-dark-900 py-4 px-6 space-y-4 animate-slide-down">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="input pr-10"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </form>

          {/* Mobile Links */}
          <div className="space-y-3 font-semibold text-sm">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-dark-700 dark:text-dark-300 hover:text-primary-500"
            >
              Home
            </Link>
            
            {/* Mobile Categories dropdown */}
            <div>
              <p className="py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</p>
              <div className="grid grid-cols-2 gap-2 pl-2 mt-1">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      handleCategoryClick(cat.slug);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-1 text-xs text-dark-600 dark:text-dark-400 hover:text-primary-500"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-dark-800 pt-3" />

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/150'}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-dark-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-dark-400">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/account/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-dark-700 dark:text-dark-300 hover:text-primary-500"
                >
                  My Profile
                </Link>
                <Link
                  to="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-dark-700 dark:text-dark-300 hover:text-primary-500"
                >
                  My Orders
                </Link>
                <Link
                  to="/account/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-dark-700 dark:text-dark-300 hover:text-primary-500"
                >
                  Wishlist ({wishlistCount})
                </Link>
                {user?.role === 'seller' && (
                  <Link
                    to="/seller/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-dark-700 dark:text-dark-300 hover:text-primary-500"
                  >
                    Seller Central
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-red-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn bg-gray-100 dark:bg-dark-800 text-dark-800 dark:text-white justify-center py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary justify-center py-2"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
