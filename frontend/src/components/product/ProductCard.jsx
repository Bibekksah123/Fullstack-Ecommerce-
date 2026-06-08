import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon as HeartOutline, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import StarRating from '../ui/StarRating';
import formatCurrency from '../../utils/formatCurrency';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import { useToggleWishlistMutation } from '../../features/user/userApi';
import { selectIsInWishlist } from '../../features/wishlist/wishlistSlice';
import { toast } from 'react-hot-toast';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const isInWishlist = useSelector(selectIsInWishlist(product._id));
  const [toggleWishlistApi, { isLoading: togglingWishlist }] = useToggleWishlistMutation();

  const discountPercentage = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please sign in to manage wishlist');
      navigate('/auth/login');
      return;
    }
    try {
      await toggleWishlistApi(product._id).unwrap();
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white dark:bg-dark-850 rounded-3xl border border-gray-100 dark:border-dark-800 shadow-card hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Product Image and Badges */}
      <div className="relative aspect-[4/3] bg-gray-50 dark:bg-dark-900 overflow-hidden flex items-center justify-center">
        <img
          src={product.thumbnail || (product.images && product.images[0]) || 'https://via.placeholder.com/400x300?text=ShopNow'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute top-4 left-4 bg-primary-500 text-white font-display font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-1.5 rounded-full shadow-glow animate-pulse-slow">
            -{discountPercentage}% Off
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={togglingWishlist}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 dark:bg-dark-900/95 text-dark-500 hover:text-primary-500 dark:text-dark-400 dark:hover:text-primary-400 shadow-md hover:scale-110 transition-all active:scale-90"
        >
          {isInWishlist ? (
            <HeartSolid className="w-5 h-5 text-primary-500 animate-scale-in" />
          ) : (
            <HeartOutline className="w-5 h-5" />
          )}
        </button>

        {/* Quick Add overlay */}
        <div className="absolute inset-0 bg-dark-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 px-4">
          <button
            onClick={handleAddToCart}
            className="w-full btn-secondary py-2.5 text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-350"
          >
            <ShoppingBagIcon className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col">
        <span className="text-[10px] uppercase tracking-wider font-bold text-secondary-500 dark:text-secondary-400 mb-1">
          {product.category?.name || 'ShopNow'}
        </span>
        <h3 className="font-display font-bold text-dark-900 dark:text-white group-hover:text-primary-500 transition-colors text-sm sm:text-base line-clamp-2 leading-snug mb-2 flex-1">
          {product.name}
        </h3>

        {/* Ratings */}
        <div className="mb-3">
          <StarRating rating={product.ratings} count={product.numReviews} size="w-3.5 h-3.5" />
        </div>

        {/* Price and Sold info */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {product.discountPrice > 0 ? (
              <>
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-primary-600 dark:text-primary-400 leading-tight">
                  {formatCurrency(product.discountPrice)}
                </span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-extrabold text-dark-900 dark:text-white leading-tight">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          
          {product.sold > 0 && (
            <span className="text-[10px] font-bold text-dark-400 bg-gray-100 dark:bg-dark-800 px-2 py-1 rounded-md">
              {product.sold} Sold
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
