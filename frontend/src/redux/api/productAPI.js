import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const productAPI = createApi({
  reducerPath: "productAPI",
  baseQuery: defaultFetchBase,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
        credentials: "include",
      }),
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `/products/getOne/${id}`,
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/products/create",
        method: "POST",
        body: productData,
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, form: productData }) => ({
        url: `/products/update/${id}`,
        method: "PUT",
        body: productData,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productAPI;
