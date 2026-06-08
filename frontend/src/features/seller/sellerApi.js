import { apiSlice } from '../api/apiSlice';

export const sellerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerSeller: builder.mutation({
      query: (data) => ({ url: '/seller/register', method: 'POST', body: data }),
    }),
    getSellerProfile: builder.query({
      query: () => '/seller/profile',
      providesTags: ['Seller'],
    }),
    updateSellerProfile: builder.mutation({
      query: (data) => ({ url: '/seller/profile', method: 'PUT', body: data }),
      invalidatesTags: ['Seller'],
    }),
    getSellerProducts: builder.query({
      query: (params) => ({ url: '/seller/products', params }),
      providesTags: ['Product'],
    }),
    getSellerOrders: builder.query({
      query: (params) => ({ url: '/seller/orders', params }),
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status, message }) => ({
        url: `/seller/orders/${id}/status`,
        method: 'PUT',
        body: { status, message },
      }),
      invalidatesTags: ['Order'],
    }),
    getSellerAnalytics: builder.query({
      query: () => '/seller/analytics',
      providesTags: ['Seller'],
    }),
    createProduct: builder.mutation({
      query: (formData) => ({ url: '/products', method: 'POST', body: formData }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/products/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useRegisterSellerMutation,
  useGetSellerProfileQuery,
  useUpdateSellerProfileMutation,
  useGetSellerProductsQuery,
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetSellerAnalyticsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = sellerApi;
