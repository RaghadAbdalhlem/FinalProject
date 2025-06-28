// src/api/favoriteAPI.js
import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const favoriteAPI = createApi({
  reducerPath: 'favoriteAPI',
  baseQuery: defaultFetchBase,
  tagTypes: ['Favorites'],
  endpoints: (builder) => ({
    // Get a user's favorite recipes
    getFavorites: builder.query({
      query: (params) => ({
        url: '/favorites',
        params,
        credentials: 'include',
      }),
      providesTags: ['Favorites'],
    }),

    // Add a recipe to the user's favorites
    addFavorite: builder.mutation({
      query: (recipeId) => ({
        url: `/favorites/add/${recipeId}`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['Favorites'],
    }),

    // Remove a recipe from the user's favorites
    removeFavorite: builder.mutation({
      query: (recipeId) => ({
        url: `/favorites/delete/${recipeId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Favorites'],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoriteAPI;
