import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const orderAPI = createApi({
  reducerPath: "orderAPI",
  baseQuery: defaultFetchBase,
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: "/orders",
        credentials: "include",
      }),
      providesTags: ["Order"],
    }),

    getOrderById: builder.query({
      query: (id) => ({
        url: `/orders/getOne/${id}`,
        credentials: "include",
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
} = orderAPI;
