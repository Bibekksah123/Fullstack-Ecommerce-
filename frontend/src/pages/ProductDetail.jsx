import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductQuery, useCreateReviewMutation, useGetProductReviewsQuery } from '../features/products/productsApi';
import ImageGallery from '../components/product/ImageGallery';
import VariantSelector from '../components/product/VariantSelector';
import StarRating from '../components/ui/StarRating';
import ProductGrid from '../components/product/ProductGrid';
import Breadcrumb from '../components/layout/Breadcrumb';
import Skeleton from '../components/ui/Skeleton';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import formatCurrency from '../utils/formatCurrency';
import { formatDate } from '../utils/helpers';
import { ShoppingBagIcon, HeartIcon, SparklesIcon, CalendarDaysIcon, HandThumbUpIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useToggleWishlistMutation } from '../features/user/userApi';
import { useSelector } from 'react-redux';
import { selectIsInWishlist } from '../features/wishlist/wishlistSlice';
import { toast } from 'react-hot-toast';

export const ProductDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { data: productData, isLoading, error } = useGetProductQuery(id);
  const { data: reviewsData } = useGetProductReviewsQuery({ productId: id });
  const [createReviewApi, { isLoading: isSubmittingReview }] = useCreateReviewMutation();
  const [toggleWishlistApi] = useToggleWishlistMutation();

  const product = productData?.data;
  const relatedProducts = productData?.related || [];
  const reviews = reviewsData?.data || [];
  const isInWishlist = useSelector(selectIsInWishlist(id));

  // Product Selection States
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');

  const handleVariantChange = (name, value) => {
    setSelectedVariants((prev) => ({ ...prev, [name]: value }));
  };

  const calculatePrice = () => {
    if (!product) return 0;
    let basePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

    // Apply variant pricing modifiers
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v) => {
        const selectedValue = selectedVariants[v.name];
        if (selectedValue) {
          const option = v.options.find((o) => o.value === selectedValue);
          if (option && option.priceModifier) {
            basePrice += option.priceModifier;
          }
        }
      });
    }
    return basePrice;
  };

  const handleAddToCart = () => {
    // Check if all variants are selected
    if (product.variants && product.variants.length > 0) {
      const allSelected = product.variants.every((v) => selectedVariants[v.name]);
      if (!allSelected) {
        toast.error('Please select all available options');
        return;
      }
    }
    addToCart(product, quantity, selectedVariants);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to update your wishlist');
      return;
    }
    try {
      await toggleWishlistApi(product._id).unwrap();
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }
    try {
      await createReviewApi({
        productId: id,
        rating: reviewRating,
        title: reviewTitle || 'Product Review',
        comment: reviewComment,
      }).unwrap();
      toast.success('Review submitted successfully!');
      setReviewComment('');
      setReviewTitle('');
      setReviewRating(5);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to submit review');
    }
  };

  if (isLoading) {
    return (
      <div className="section py-8 space-y-8">
        <Skeleton variant="text" width="40%" height="1.5rem" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton variant="rectangular" className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton variant="text" width="70%" height="2.5rem" />
            <Skeleton variant="text" width="40%" height="1.5rem" />
            <Skeleton variant="rectangular" className="h-24 w-full" />
            <Skeleton variant="text" width="30%" height="2rem" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="section py-16 text-center">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-gray-500 mt-2">The product you are trying to view does not exist or has been removed.</p>
        <Link to="/products" className="btn-primary mt-6">Back to Products</Link>
      </div>
    );
  }

  const currentPrice = calculatePrice();
  const originalPrice = product.discountPrice > 0 ? product.price : 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="section py-8 space-y-16">
      <Breadcrumb
        items={[
          { label: 'Products', path: '/products' },
          { label: product.category?.name, path: `/category/${product.category?.slug}` },
          { label: product.name },
        ]}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        
        {/* Left column: Image Gallery */}
        <ImageGallery images={product.images} />

        {/* Right column: Info & actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-extrabold text-secondary-500 bg-secondary-50 dark:bg-secondary-500/10 px-3 py-1 rounded-full">
              {product.brand || 'ShopNow Brand'}
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-dark-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            
            {/* Rating display */}
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} count={product.numReviews} />
              <span className="text-gray-300 dark:text-dark-700">|</span>
              <span className="text-xs text-dark-500 font-semibold">{product.sold} Sold</span>
            </div>
          </div>

          <div className="border-t border-b border-gray-100 dark:border-dark-800 py-4 flex items-center justify-between">
            {/* Price display */}
            <div className="flex flex-col">
              {originalPrice > 0 ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-primary-600 dark:text-primary-400">
                    {formatCurrency(currentPrice)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                  <span className="text-[10px] font-extrabold bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-md">
                    Save {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                  </span>
                </div>
              ) : (
                <span className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white">
                  {formatCurrency(currentPrice)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div>
              {isOutOfStock ? (
                <span className="text-xs font-bold bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400 px-3 py-1.5 rounded-full">
                  Out of Stock
                </span>
              ) : (
                <span className="text-xs font-bold bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 px-3 py-1.5 rounded-full">
                  In Stock ({product.stock} left)
                </span>
              )}
            </div>
          </div>

          {/* Description summary */}
          <p className="text-sm font-medium text-dark-600 dark:text-dark-300 leading-relaxed">
            {product.shortDescription || product.description.substring(0, 250) + '...'}
          </p>

          {/* Variants Selector */}
          <VariantSelector
            variants={product.variants}
            selectedVariants={selectedVariants}
            onChange={handleVariantChange}
          />

          {/* Quantity selector and actions */}
          {!isOutOfStock && (
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-wider font-bold text-dark-500 dark:text-dark-400">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-100 dark:bg-dark-800 rounded-2xl p-1 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-xl hover:bg-white dark:hover:bg-dark-700 text-dark-500"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-dark-950 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 rounded-xl hover:bg-white dark:hover:bg-dark-700 text-dark-500"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add actions */}
          <div className="flex flex-col sm:flex-row gap-4.5 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 btn-primary py-3.5 font-bold shadow-glow text-sm flex items-center justify-center gap-2"
            >
              <ShoppingBagIcon className="w-5 h-5" /> Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`btn border-2 py-3.5 px-6 rounded-2xl flex items-center justify-center gap-1.5 transition-all font-bold text-sm ${
                isInWishlist
                  ? 'border-primary-500 text-primary-500 bg-primary-50/5'
                  : 'border-gray-200 dark:border-dark-750 text-dark-700 dark:text-dark-300 hover:border-gray-300 dark:hover:border-dark-650'
              }`}
            >
              {isInWishlist ? (
                <>
                  <HeartSolid className="w-5 h-5 text-primary-500" /> Wishlisted
                </>
              ) : (
                <>
                  <HeartIcon className="w-5 h-5" /> Add to Wishlist
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Specifications & description section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-8 border-t border-gray-100 dark:border-dark-800">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display font-bold text-xl text-dark-900 dark:text-white">
            Product Description
          </h3>
          <div className="text-sm font-semibold text-dark-600 dark:text-dark-350 leading-relaxed whitespace-pre-line space-y-4">
            {product.description}
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl text-dark-900 dark:text-white">
              Specifications
            </h3>
            <div className="card border border-gray-100 dark:border-dark-800 overflow-hidden divide-y divide-gray-100 dark:divide-dark-800">
              {product.specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-2 p-3.5 text-xs sm:text-sm font-semibold">
                  <span className="text-dark-500">{spec.key}</span>
                  <span className="text-dark-800 dark:text-dark-200 font-bold">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reviews and Ratings Section */}
      <div className="space-y-8 pt-8 border-t border-gray-100 dark:border-dark-800">
        <h3 className="font-display font-bold text-xl text-dark-900 dark:text-white">
          Customer Reviews ({reviews.length})
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Review Aggregates */}
          <div className="card p-6 flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-5xl font-black text-dark-900 dark:text-white leading-none">
              {product.rating.toFixed(1)}
            </span>
            <StarRating rating={product.rating} size="w-5 h-5" />
            <span className="text-xs text-dark-400 font-semibold">
              Based on {product.numReviews} review ratings
            </span>
          </div>

          {/* Review comments list */}
          <div className="lg:col-span-2 space-y-5">
            {reviews.length === 0 ? (
              <p className="text-sm text-dark-500 font-semibold bg-gray-50 dark:bg-dark-900 p-6 rounded-2xl border border-gray-100 dark:border-dark-800 text-center">
                No reviews yet for this product. Be the first to write one!
              </p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="card p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.user?.avatar || 'https://via.placeholder.com/100'}
                        alt={rev.user?.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-dark-800"
                      />
                      <div>
                        <p className="text-sm font-bold text-dark-900 dark:text-white">{rev.user?.name}</p>
                        <span className="flex items-center gap-2 text-xs text-dark-400 font-medium mt-0.5">
                          <CalendarDaysIcon className="w-3.5 h-3.5" />
                          {formatDate(rev.createdAt)}
                        </span>
                      </div>
                    </div>
                    <StarRating rating={rev.rating} size="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-dark-900 dark:text-white mb-1">{rev.title}</h5>
                    <p className="text-sm text-dark-600 dark:text-dark-350 font-medium leading-relaxed">{rev.comment}</p>
                  </div>
                </div>
              ))
            )}

            {/* Write a Review form */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="card p-6 space-y-4 border-2 border-primary-500/10">
                <h4 className="font-display font-bold text-base text-dark-900 dark:text-white flex items-center gap-1.5">
                  <SparklesIcon className="w-5 h-5 text-primary-500" /> Write a Customer Review
                </h4>
                <div className="flex gap-4 items-center">
                  <label className="text-xs uppercase tracking-wider font-bold text-dark-500 dark:text-dark-400">
                    Rating
                  </label>
                  <StarRating rating={reviewRating} interactive={true} onChange={setReviewRating} size="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <label className="label">Review Title</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Excellent purchase, highly recommend!"
                    className="input py-2"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="label">Comment</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write your feedback here..."
                    rows="4"
                    className="input"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="btn-primary py-2.5 font-bold shadow-glow text-xs"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="card p-6 bg-gray-50 dark:bg-dark-900/40 text-center font-medium border border-gray-100 dark:border-dark-800">
                <p className="text-sm text-dark-500">
                  Please{' '}
                  <Link to="/auth/login" className="text-primary-500 font-bold hover:underline">
                    Sign In
                  </Link>{' '}
                  to leave a product review.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-gray-100 dark:border-dark-800">
          <h3 className="font-display font-bold text-lg sm:text-xl text-dark-900 dark:text-white">
            Related Products
          </h3>
          <ProductGrid products={relatedProducts} count={4} />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
