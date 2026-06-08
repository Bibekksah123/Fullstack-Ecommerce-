import React from 'react';
import { useGetWishlistQuery, useToggleWishlistMutation, useMoveToCartMutation } from '../../features/user/userApi';
import Skeleton from '../../components/ui/Skeleton';
import Breadcrumb from '../../components/layout/Breadcrumb';
import EmptyState from '../../components/ui/EmptyState';
import formatCurrency from '../../utils/formatCurrency';
import { TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export const Wishlist = () => {
  const { data: wishlistData, isLoading, refetch } = useGetWishlistQuery();
  const wishlist = wishlistData?.data || [];

  const [toggleWishlistApi] = useToggleWishlistMutation();
  const [moveToCartApi, { isLoading: isMoving }] = useMoveToCartMutation();

  const handleRemove = async (productId) => {
    try {
      await toggleWishlistApi(productId).unwrap();
      toast.success('Removed from wishlist');
      refetch();
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await moveToCartApi(productId).unwrap();
      toast.success('Moved product to cart!');
      refetch();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to move to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="section py-8 space-y-6">
        <Skeleton variant="text" width="30%" height="2rem" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} variant="rectangular" className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section py-6 space-y-8 animate-fade-in">
      <Breadcrumb items={[{ label: 'My Account', path: '/account/profile' }, { label: 'Wishlist' }]} />

      <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
        My Wishlist
      </h2>

      {wishlist.length === 0 ? (
        <div className="card p-16 flex justify-center items-center">
          <EmptyState
            title="Wishlist is Empty"
            description="You haven't saved any items yet. Explore the shop and click the heart icon on your favorite items!"
            actionLabel="Explore Shop"
            actionPath="/products"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = item; // Backend populate returns the product document directly
            if (!product) return null;
            
            const price = product.discountPrice > 0 ? product.discountPrice : product.price;

            return (
              <div
                key={product._id}
                className="group card overflow-hidden relative flex flex-col hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-gray-50 dark:bg-dark-900 overflow-hidden flex items-center justify-center relative">
                  <img
                    src={product.thumbnail || (product.images && product.images[0]) || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-dark-900/90 text-red-500 hover:bg-red-500 hover:text-white shadow-md active:scale-95 transition-all"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-sm text-dark-900 dark:text-white line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-primary-500 font-extrabold mt-1">
                      {formatCurrency(price)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product._id)}
                    disabled={isMoving || product.stock <= 0}
                    className="w-full btn bg-secondary-50 hover:bg-secondary-500 hover:text-white text-secondary-600 dark:bg-secondary-500/10 dark:hover:bg-secondary-500 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <ShoppingCartIcon className="w-4.5 h-4.5" />
                    {product.stock <= 0 ? 'Out of Stock' : 'Move to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
