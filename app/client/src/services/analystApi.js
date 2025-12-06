// /src/services/analystApi.js\

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from "./apiSlice"

export const analystApi = createApi({
    reducerPath: "analystApi",
    baseQuery: baseQuery,

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
