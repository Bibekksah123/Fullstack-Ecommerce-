import { createSlice } from '@reduxjs/toolkit';

// Guest cart from localStorage
const getGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem('shopnow_cart') || '[]');
  } catch {
    return [];
  }
};

const initialState = {
  items: getGuestCart(),
  loading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // For guest users (localStorage)
    addToGuestCart: (state, action) => {
      const { product, quantity = 1, variant } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product._id === product._id && JSON.stringify(item.variant) === JSON.stringify(variant)
      );
      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        const price = product.discountPrice > 0 ? product.discountPrice : product.price;
        state.items.push({ product, quantity, variant: variant || {}, price, _id: Date.now().toString() });
      }
      localStorage.setItem('shopnow_cart', JSON.stringify(state.items));
    },
    removeFromGuestCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem('shopnow_cart', JSON.stringify(state.items));
    },
    updateGuestCartItem: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((i) => i._id === itemId);
      if (item) item.quantity = quantity;
      localStorage.setItem('shopnow_cart', JSON.stringify(state.items));
    },
    clearGuestCart: (state) => {
      state.items = [];
      localStorage.removeItem('shopnow_cart');
    },
    // For authenticated users (from API)
    setCart: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { addToGuestCart, removeFromGuestCart, updateGuestCartItem, clearGuestCart, setCart, setLoading } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((acc, item) => {
    const price = item.price || (item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price) || 0;
    return acc + price * item.quantity;
  }, 0);
