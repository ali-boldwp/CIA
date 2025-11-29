// /src/services/analystApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const analystApi = createApi({
    reducerPath: "analystApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_BASE_URL, // http://localhost:4000/api/v1
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),

    tagTypes: ["Analysts"],

    endpoints: (builder) => ({
        // -------- FETCH ALL ANALYSTS --------
        getAnalysts: builder.query({
            query: () => "/analyst",
            providesTags: ["Analysts"],
        }),

        // -------- CREATE ANALYST --------
        createAnalyst: builder.mutation({
            query: (data) => ({
                url: "/analyst",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Analysts"],
        }),

        // -------- UPDATE ANALYST --------
        updateAnalyst: builder.mutation({
            query: ({ id, data }) => ({
                url: `/analyst/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Analysts"],
        }),

        // -------- DELETE ANALYST --------
        deleteAnalyst: builder.mutation({
            query: (id) => ({
                url: `/analyst/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Analysts"],
        }),
    }),
});

// EXPORT HOOKS
export const {
    useGetAnalystsQuery,
    useCreateAnalystMutation,
    useUpdateAnalystMutation,
    useDeleteAnalystMutation,
} = analystApi;

export default analystApi;
