// /src/services/userApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        }
    }),

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
    }),
});

export const {
    useGetAllUsersQuery,
    useGetAnalystsQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = userApi;
