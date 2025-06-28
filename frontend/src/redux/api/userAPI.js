import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: defaultFetchBase,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    getUserById: builder.query({
      query: (id) => ({
        url: `/users/getOne/${id}`,
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: "/users/create",
        method: "POST",
        body: userData,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: (passData) => ({
        url: "/users/change-password",
        method: "POST",
        body: passData,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query({ id, data }) {
        console.log(data)
        return {
          url: `/users/update/${id}`,
          method: 'PUT',
          credentials: 'include',
          body: data,
        };
      },

      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    updateProfile: builder.mutation({
      query: (userData) => ({
        url: `/users/updateProfile`,
        method: "PUT",
        body: userData,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    blockUser: builder.mutation({
      query: (id) => ({
        url: `/users/block/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),

    unblockUser: builder.mutation({
      query: (id) => ({
        url: `/users/unblock/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useDeleteUserMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userAPI;
