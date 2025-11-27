// src/services/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://your-api.com' }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: '/login',   // 👈 THIS is your endpoint
                method: 'POST',
                body,
            }),
        }),

        getUser: builder.query({
            query: () => '/user/me',  // 👈 Another endpoint
        }),
    }),
});

export const { useLoginMutation, useGetUserQuery } = authApi;
