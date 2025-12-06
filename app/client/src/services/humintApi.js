import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from './apiSlice';

export const humintApi = createApi({
    reducerPath: "humintApi",
    baseQuery: baseQueryWithReauth,

    endpoints: (builder) => ({

        // ---------------------------------
        // CREATE HUMINT REQUEST
        // ---------------------------------
        createHumint: builder.mutation({
            query: (data) => ({
                url: "/humint",
                method: "POST",
                body: data,
            }),
        }),

        // ---------------------------------
        // GET ALL HUMINT REQUESTS
        // ---------------------------------
        getAllHumints: builder.query({
            query: () => "/humint",
        }),

        // ---------------------------------
        // GET HUMINT BY ID
        // ---------------------------------
        getHumintById: builder.query({
            query: (id) => `/humint/${id}`,
        }),

        // ---------------------------------
        // UPDATE HUMINT (draft or clarification)
        // ---------------------------------
        updateHumint: builder.mutation({
            query: ({ id, data }) => ({
                url: `/humint/${id}`,
                method: "PUT",
                body: data,
            }),
        }),

        // ---------------------------------
        // SUBMIT FOR APPROVAL
        // ---------------------------------
        submitHumint: builder.mutation({
            query: (id) => ({
                url: `/humint/${id}/submit`,
                method: "PATCH",
            }),
        }),

        // ---------------------------------
        // MANAGER: APPROVE
        // ---------------------------------
        approveHumint: builder.mutation({
            query: (id) => ({
                url: `/humint/${id}/approve`,
                method: "PATCH",
            }),
        }),

        // ---------------------------------
        // MANAGER: REJECT
        // ---------------------------------
        rejectHumint: builder.mutation({
            query: ({ id, feedback }) => ({
                url: `/humint/${id}/reject`,
                method: "PATCH",
                body: { managerFeedback: feedback },
            }),
        }),

        // ---------------------------------
        // MANAGER: REQUEST CLARIFICATION
        // ---------------------------------
        clarificationHumint: builder.mutation({
            query: ({ id, feedback }) => ({
                url: `/humint/${id}/clarification`,
                method: "PATCH",
                body: { managerFeedback: feedback },
            }),
        }),

        // ---------------------------------
        // MARK COMPLETED
        // ---------------------------------
        completeHumint: builder.mutation({
            query: (id) => ({
                url: `/humint/${id}/complete`,
                method: "PATCH",
            }),
        }),

        // ---------------------------------
        // DELETE HUMINT
        // ---------------------------------
        deleteHumint: builder.mutation({
            query: (id) => ({
                url: `/humint/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useCreateHumintMutation,
    useGetAllHumintsQuery,

    useGetHumintByIdQuery,
    useUpdateHumintMutation,
    useSubmitHumintMutation,
    useApproveHumintMutation,
    useRejectHumintMutation,
    useClarificationHumintMutation,
    useCompleteHumintMutation,
    useDeleteHumintMutation,
} = humintApi;
