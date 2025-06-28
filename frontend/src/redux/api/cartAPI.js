import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const cartAPI = createApi({
  reducerPath: "cartAPI",
  baseQuery: defaultFetchBase,
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getMyCarts: builder.query({
      query: (params) => ({
        url: "/carts/mycart",
        params,
        credentials: "include",
      }),
      providesTags: ["Cart"],
    }),

    createCart: builder.mutation({
      query: (cart) => ({
        url: "/carts/create",
        method: "POST",
        body: cart,
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    deleteCart: builder.mutation({
      query: (id) => ({
        url: `/carts/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    checkoutCart: builder.mutation({
      query: (checkoutData) => ({
        url: "/carts/checkout",
        method: "POST",
        body: checkoutData,
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetMyCartsQuery,
  useCreateCartMutation,
  useDeleteCartMutation,
  useCheckoutCartMutation
} = cartAPI;
