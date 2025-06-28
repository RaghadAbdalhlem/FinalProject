import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const recipeAPI = createApi({
  reducerPath: "recipeAPI",
  baseQuery: defaultFetchBase,
  tagTypes: ["Recipe"],
  endpoints: (builder) => ({
    getRecipes: builder.query({
      query: (params) => ({
        url: "/recipes",
        params,
        credentials: "include",
      }),
      providesTags: ["Recipe"],
    }),

    getRecipeById: builder.query({
      query: (id) => ({
        url: `/recipes/getOne/${id}`,
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Recipe", id }],
    }),

    createRecipe: builder.mutation({
      query: (recipeData) => ({
        url: "/recipes/create",
        method: "POST",
        body: recipeData,
        credentials: "include",
      }),
      invalidatesTags: ["Recipe"],
    }),

    updateRecipe: builder.mutation({
      query: ({ id, form: recipeData }) => ({
        url: `/recipes/update/${id}`,
        method: "PUT",
        body: recipeData,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Recipe", id }],
    }),

    deleteRecipe: builder.mutation({
      query: (id) => ({
        url: `/recipes/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Recipe"],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = recipeAPI;
