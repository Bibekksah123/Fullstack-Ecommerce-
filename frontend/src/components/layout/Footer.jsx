import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-dark-800 text-dark-600 dark:text-dark-400 mt-20 transition-base">
      
      {/* Trust Badges */}
      <div className="border-b border-gray-100 dark:border-dark-800 py-8 bg-gray-50/50 dark:bg-dark-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <TruckIcon className="w-10 h-10 text-primary-500 flex-shrink-0" />
            <div>
              <h4 className="font-display font-bold text-sm text-dark-900 dark:text-white">Free & Fast Shipping</h4>
              <p className="text-xs text-dark-400">On all orders above Rs. 1,500</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ArrowPathIcon className="w-10 h-10 text-secondary-500 flex-shrink-0" />
            <div>
              <h4 className="font-display font-bold text-sm text-dark-900 dark:text-white">7 Days Easy Return</h4>
              <p className="text-xs text-dark-400">Hassle-free money back guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheckIcon className="w-10 h-10 text-primary-500 flex-shrink-0" />
            <div>
              <h4 className="font-display font-bold text-sm text-dark-900 dark:text-white">100% Secure Payment</h4>
              <p className="text-xs text-dark-400">Stripe and Cash on Delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheckIcon className="w-10 h-10 text-secondary-500 flex-shrink-0" />
            <div>
              <h4 className="font-display font-bold text-sm text-dark-900 dark:text-white">Dedicated Support</h4>
              <p className="text-xs text-dark-400">24/7 friendly customer service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* About ShopNow */}
        <div className="lg:col-span-2 space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-display font-extrabold text-lg shadow-glow">
              S
            </span>
            <span className="font-display font-black text-xl tracking-tight bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ShopNow
            </span>
          </Link>
          <p className="text-sm text-dark-500 dark:text-dark-400 max-w-sm leading-relaxed">
            ShopNow is your ultimate one-stop-shop for the latest electronics, fashion, groceries, beauty products, and more. Experience the joy of effortless shopping.
          </p>
          <div className="flex gap-4.5">
            <a href="#" className="p-2.5 rounded-full bg-gray-50 dark:bg-dark-800 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="#" className="p-2.5 rounded-full bg-gray-50 dark:bg-dark-800 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" className="p-2.5 rounded-full bg-gray-50 dark:bg-dark-800 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 10.001 12.324A6.162 6.162 0 0012 5.838zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-display font-bold text-dark-900 dark:text-white text-base mb-6">Customer Care</h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <li><Link to="/orders/track" className="hover:text-primary-500 transition-colors">Track Your Order</Link></li>
            <li><a href="#" className="hover:text-primary-500 transition-colors">Help Center / FAQs</a></li>
            <li><a href="#" className="hover:text-primary-500 transition-colors">Return & Refunds</a></li>
            <li><a href="#" className="hover:text-primary-500 transition-colors">Shipping & Delivery</a></li>
            <li><a href="#" className="hover:text-primary-500 transition-colors">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold text-dark-900 dark:text-white text-base mb-6">Quick Links</h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <li><Link to="/products" className="hover:text-primary-500 transition-colors">Browse Products</Link></li>
            <li><Link to="/seller/register" className="hover:text-primary-500 transition-colors">Sell on ShopNow</Link></li>
            <li><Link to="/account/profile" className="hover:text-primary-500 transition-colors">My Account</Link></li>
            <li><Link to="/account/wishlist" className="hover:text-primary-500 transition-colors">My Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-primary-500 transition-colors">Shopping Cart</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="font-display font-bold text-dark-900 dark:text-white text-base mb-6">Join Our Newsletter</h4>
          <p className="text-sm text-dark-500 dark:text-dark-400 mb-4 leading-relaxed">
            Subscribe to get updates on flash sales, new products, and exclusive coupons.
          </p>
          <form className="space-y-2.5" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="input w-full"
              required
            />
            <button type="submit" className="btn-primary w-full py-2.5 text-sm font-bold shadow-md">
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 dark:border-dark-800 py-6 bg-gray-50/30 dark:bg-dark-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-dark-400">
          <div>
            © {new Date().getFullYear()} ShopNow E-Commerce. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Cookie Policy</a>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
