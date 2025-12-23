// /src/services/userApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import baseQuery from './apiSlice';

export const userApi = createApi({
    reducerPath: 'userApi',

    baseQuery: baseQuery,

    tagTypes: ["Users", "Analysts"],

    endpoints: (builder) => ({

       
        getAllUsers: builder.query({
            query: () => "/users",
            providesTags: ["Users"]
        }),


        getAnalysts: builder.query({
            query: () => "/users?role=analyst",
            providesTags: ["Analysts"]
        }),


        createUser: builder.mutation({
            query: (data) => ({
                url: "/users",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users", "Analysts"],
        }),


        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Users", "Analysts"],
        }),


        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users", "Analysts"],
        }),
        getMe: builder.query({
            query: () => "/users/me",
        }),
        updateMyProfile: builder.mutation({
            query: (data) => ({
                url: "/users/profile",
                method: "PUT",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetAnalystsQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUpdateMyProfileMutation,
    useGetMeQuery,
} = userApi;
