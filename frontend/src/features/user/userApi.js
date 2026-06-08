import { apiSlice } from '../api/apiSlice';
import { setWishlist } from '../wishlist/wishlistSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({ url: '/users/profile', method: 'PUT', body: formData }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({ url: '/users/change-password', method: 'PUT', body: data }),
    }),
    getAddresses: builder.query({
      query: () => '/users/addresses',
      providesTags: ['User'],
    }),
    addAddress: builder.mutation({
      query: (data) => ({ url: '/users/addresses', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/users/addresses/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['User'],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({ url: `/users/addresses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    getWallet: builder.query({
      query: () => '/users/wallet',
      providesTags: ['User'],
    }),
    // Wishlist
    getWishlist: builder.query({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setWishlist(data.data));
      },
    }),
    toggleWishlist: builder.mutation({
      query: (productId) => ({ url: `/wishlist/${productId}`, method: 'POST' }),
      invalidatesTags: ['Wishlist'],
    }),
    moveToCart: builder.mutation({
      query: (productId) => ({ url: `/wishlist/${productId}/move-to-cart`, method: 'POST' }),
      invalidatesTags: ['Wishlist', 'Cart'],
    }),
    // Orders
    getMyOrders: builder.query({
      query: (params) => ({ url: '/orders', params }),
      providesTags: ['Order'],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation({
      query: (data) => ({ url: '/orders', method: 'POST', body: data }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    cancelOrder: builder.mutation({
      query: ({ id, reason }) => ({ url: `/orders/${id}/cancel`, method: 'PUT', body: { reason } }),
      invalidatesTags: ['Order'],
    }),
    requestReturn: builder.mutation({
      query: ({ id, reason }) => ({ url: `/orders/${id}/return`, method: 'PUT', body: { reason } }),
      invalidatesTags: ['Order'],
    }),
    // Notifications
    getNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({ url: '/notifications/read-all', method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
    // Payments
    createPaymentIntent: builder.mutation({
      query: (data) => ({ url: '/payments/stripe/intent', method: 'POST', body: data }),
    }),
    confirmPayment: builder.mutation({
      query: (data) => ({ url: '/payments/stripe/confirm', method: 'POST', body: data }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetWalletQuery,
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useMoveToCartMutation,
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useRequestReturnMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} = userApi;
