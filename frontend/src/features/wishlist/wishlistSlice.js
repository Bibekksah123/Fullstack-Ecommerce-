import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    toggleWishlistItem: (state, action) => {
      const id = action.payload;
      const exists = state.items.find((item) => item._id === id || item === id);
      if (exists) {
        state.items = state.items.filter((item) => (item._id || item) !== id);
      } else {
        state.items.push(id);
      }
    },
  },
});

export const { setWishlist, toggleWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
export const selectWishlist = (state) => state.wishlist.items;
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some((item) => (item._id || item) === productId);
