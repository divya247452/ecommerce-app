import { apiSlice } from "./apiSlice";
import { PRODUCTS_URL } from "../constants";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getProducts: builder.query({
      query: ({ keyword, pageNumber, category, brand, minPrice, maxPrice, rating, sortBy }) => ({
        url: PRODUCTS_URL,
        params: {
          keyword,
          pageNumber,
          category,
          brand,
          minPrice,
          maxPrice,
          rating,
          sortBy,
        },
      }),
      keepUnusedDataFor: 5,
    }),
    

    getTopProducts: builder.query({
      query: () => ({
        url:`${PRODUCTS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),

    getProductById: builder.query({
      query: (productID) => `${PRODUCTS_URL}/${productID}`,
      keepUnusedDataFor: 5,
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetTopProductsQuery,
  useGetProductByIdQuery,
  useCreateReviewMutation,
} = productsApiSlice;
