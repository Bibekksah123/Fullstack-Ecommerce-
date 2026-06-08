import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  addToGuestCart,
  removeFromGuestCart,
  updateGuestCartItem,
  clearGuestCart,
} from '../features/cart/cartSlice';
import {
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useSyncGuestCartMutation,
} from '../features/cart/cartApi';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';

export const useCart = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);
  const cartSubtotal = useSelector(selectCartSubtotal);

  const [apiAddToCart] = useAddToCartMutation();
  const [apiUpdateCartItem] = useUpdateCartItemMutation();
  const [apiRemoveFromCart] = useRemoveFromCartMutation();
  const [apiClearCart] = useClearCartMutation();
  const [apiSyncCart] = useSyncGuestCartMutation();

  const handleAddToCart = async (product, quantity = 1, variant = {}) => {
    if (isAuthenticated) {
      try {
        await apiAddToCart({
          productId: product._id,
          quantity,
          variant,
        }).unwrap();
        toast.success('Added to cart');
      } catch (err) {
        toast.error(err.data?.message || 'Failed to add to cart');
      }
    } else {
      dispatch(addToGuestCart({ product, quantity, variant }));
      toast.success('Added to guest cart');
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    if (isAuthenticated) {
      try {
        await apiUpdateCartItem({ itemId, quantity }).unwrap();
      } catch (err) {
        toast.error(err.data?.message || 'Failed to update quantity');
      }
    } else {
      dispatch(updateGuestCartItem({ itemId, quantity }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (isAuthenticated) {
      try {
        await apiRemoveFromCart(itemId).unwrap();
        toast.success('Removed from cart');
      } catch (err) {
        toast.error(err.data?.message || 'Failed to remove item');
      }
    } else {
      dispatch(removeFromGuestCart(itemId));
      toast.success('Removed from guest cart');
    }
  };

  const handleClearCart = async () => {
    if (isAuthenticated) {
      try {
        await apiClearCart().unwrap();
        toast.success('Cart cleared');
      } catch (err) {
        toast.error(err.data?.message || 'Failed to clear cart');
      }
    } else {
      dispatch(clearGuestCart());
      toast.success('Cart cleared');
    }
  };

  const syncCart = async () => {
    if (isAuthenticated && cartItems.length > 0) {
      // Find guest items
      const guestItems = cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        variant: item.variant || {},
      }));

      try {
        await apiSyncCart(guestItems).unwrap();
        dispatch(clearGuestCart());
      } catch (err) {
        console.error('Failed to sync guest cart', err);
      }
    }
  };

  return {
    cartItems,
    cartCount,
    cartSubtotal,
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveItem,
    clearCart: handleClearCart,
    syncCart,
  };
};

export default useCart;
