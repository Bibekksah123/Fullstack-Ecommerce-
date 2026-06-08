import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Breadcrumb from '../components/layout/Breadcrumb';
import EmptyState from '../components/ui/EmptyState';
import { useGetCartQuery } from '../features/cart/cartApi';

export const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart } = useCart();
  
  // Trigger active fetch for authenticated cart sync
  const { isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });

  const [activeCoupon, setActiveCoupon] = useState(() => {
    try {
      const saved = sessionStorage.getItem('active_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleApplyCoupon = (couponData) => {
    setActiveCoupon(couponData);
    sessionStorage.setItem('active_coupon', JSON.stringify(couponData));
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    sessionStorage.removeItem('active_coupon');
  };

  const handleCheckout = (summaryDetails) => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout', { state: { ...summaryDetails, coupon: activeCoupon } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="section py-16 flex justify-center items-center">
        <EmptyState
          title="Your Cart is Empty"
          description="It looks like you haven't added any products to your cart yet. Explore our latest arrivals to get started!"
          actionLabel="Browse Products"
          actionPath="/products"
        />
      </div>
    );
  }

  return (
    <div className="section py-6 space-y-6">
      <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

      <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
        Shopping Cart
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-2 card p-6 md:p-8 space-y-2">
          <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white pb-3 border-b border-gray-100 dark:border-dark-800">
            Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </h3>
          
          <div className="divide-y divide-gray-100 dark:divide-dark-800">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        </div>

        {/* Checkout Summary panel */}
        <CartSummary
          subtotal={cartSubtotal}
          coupon={activeCoupon}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};

export default Cart;
