import { apiSlice } from '../api/apiSlice';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    searchProducts: builder.query({
      query: (params) => ({ url: '/products/search', params }),
    }),
    getFeaturedProducts: builder.query({
      query: () => '/products/featured',
      providesTags: ['Product'],
    }),
    getFlashSaleProducts: builder.query({
      query: () => '/products/flash-sale',
      providesTags: ['Product'],
    }),
    getCategories: builder.query({
      query: (params) => ({ url: '/categories', params }),
      providesTags: ['Category'],
    }),
    getCategoryBySlug: builder.query({
      query: (slug) => `/categories/${slug}`,
      providesTags: ['Category'],
    }),
    getProductReviews: builder.query({
      query: ({ productId, ...params }) => ({ url: `/reviews/product/${productId}`, params }),
      providesTags: ['Review'],
    }),
    createReview: builder.mutation({
      query: ({ productId, ...data }) => ({
        url: `/reviews/${productId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Review', 'Product'],
    }),
    markReviewHelpful: builder.mutation({
      query: (id) => ({ url: `/reviews/${id}/helpful`, method: 'POST' }),
      invalidatesTags: ['Review'],
    }),
    replyToReview: builder.mutation({
      query: ({ id, text }) => ({ url: `/reviews/${id}/reply`, method: 'PUT', body: { text } }),
      invalidatesTags: ['Review'],
    }),
    validateCoupon: builder.mutation({
      query: (data) => ({ url: '/coupons/validate', method: 'POST', body: data }),
    }),
    getCoupons: builder.query({
      query: () => '/coupons',
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useSearchProductsQuery,
  useGetFeaturedProductsQuery,
  useGetFlashSaleProductsQuery,
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useMarkReviewHelpfulMutation,
  useReplyToReviewMutation,
  useValidateCouponMutation,
  useGetCouponsQuery,
} = productsApi;
