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

    tagTypes: ["Analysts"],

    endpoints: (builder) => ({

        // ========= GET ALL ANALYSTS =========
        getAnalysts: builder.query({
            query: () => "/users",   // 👈 FIXED role
            providesTags: ["Analysts"]
        }),

        // ========= CREATE ANALYST =========
        createAnalyst: builder.mutation({
            query: (data) => ({
                url: "/users",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Analysts"],
        }),

        // ========= UPDATE ANALYST =========
        updateAnalyst: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Analysts"],
        }),

        // ========= DELETE ANALYST =========
        deleteAnalyst: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Analysts"],
        }),
    }),
});

export const {
    useGetAnalystsQuery,
    useCreateAnalystMutation,
    useUpdateAnalystMutation,
    useDeleteAnalystMutation
} = userApi;
