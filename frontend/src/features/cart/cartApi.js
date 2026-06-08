import { apiSlice } from '../api/apiSlice';
import { setCart } from './cartSlice';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCart(data.data));
      },
    }),
    addToCart: builder.mutation({
      query: (data) => ({ url: '/cart', method: 'POST', body: data }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({ url: `/cart/${itemId}`, method: 'PUT', body: { quantity } }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation({
      query: (itemId) => ({ url: `/cart/${itemId}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation({
      query: () => ({ url: '/cart', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    syncGuestCart: builder.mutation({
      query: (guestCart) => ({ url: '/cart/sync', method: 'POST', body: { guestCart } }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useSyncGuestCartMutation,
} = cartApi;
