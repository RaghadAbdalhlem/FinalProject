import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getMeAPI } from './getMeAPI';
import { setToken, setUserData, removeToken, removeUserData } from '../../utils/Utils';
import { logout, setUser } from './userSlice';

const baseUrl = `${process.env.REACT_APP_SERVER_ENDPOINT}/api`;

export const authAPI = createApi({
    reducerPath: 'authAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query(data) {
                return {
                    url: '/auth/register',
                    method: 'POST',
                    body: data,
                };
            },
        }),
        loginUser: builder.mutation({
            query(data) {
                return {
                    url: '/auth/login',
                    method: 'POST',
                    body: data,
                    credentials: 'include',
                };
            },
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    setToken(data.accessToken);
                    dispatch(setUser({ token: data.accessToken }));
                    setUserData(JSON.stringify(data.userData));
                    await dispatch(getMeAPI.endpoints.getMe.initiate(null));
                } catch (error) { }
            },
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: '/users/logout',
                method: 'GET',
            }),
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    removeToken();
                    removeUserData();
                    dispatch(logout());
                } catch (error) {
                    console.error('Logout error:', error);
                }
            },
        }),
        adminLoginUser: builder.mutation({
            query(data) {
                return {
                    url: '/auth/admin-login',
                    method: 'POST',
                    body: data,
                    credentials: 'include',
                };
            },
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    setToken(data.accessToken);
                    setUserData(JSON.stringify(data.userData));
                    await dispatch(getMeAPI.endpoints.getMe.initiate(null));
                } catch (error) { }
            },
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: data,
            })
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data,
            })
        }),
    }),
});

export const {
    useLoginUserMutation,
    useRegisterUserMutation,
    useAdminLoginUserMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLogoutUserMutation,
} = authAPI;
