// src/services/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { setUser } from '../features/auth/authSlice';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_AUTH_API,
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    console.log( data.data.accessToken )

                    // backend should set refresh token as HttpOnly cookie
                    // we just store the access token
                    Cookies.set('accessToken', data.data.accessToken, {
                        expires: 1,
                        sameSite: 'strict',
                        secure: true,
                    });
                } catch (err) {
                    console.error('Login failed', err);
                }
            },
        }),

        getUser: builder.query({
            query: () => '/user/me',  // 👈 Another endpoint
        }),
        heartbeat: builder.query({
            query: () => ({
                url: '/heartbeat',
                method: 'GET',
            }),
            async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    const { accessToken, user } = data.data || {};

                    if (accessToken) {
                        Cookies.set('accessToken', accessToken, {
                            expires: 1,
                            sameSite: 'strict',
                            secure: false,
                        });
                        localStorage.setItem('token', accessToken);
                    }

                    if (user) {
                        dispatch(setUser(user));
                        localStorage.setItem('user', JSON.stringify(user));
                    }
                } catch (err) {
                    console.error('Heartbeat failed', err);
                }
            },
        }),
    }),
});

export const { useLoginMutation, useGetUserQuery, useHeartbeatQuery } = authApi;
