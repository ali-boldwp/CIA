import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./apiSlice";

export const humintApi = createApi({
    reducerPath: "humintApi",
    baseQuery: baseQuery,

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
        // MANAGER: REQUEST CLARIFICATION (status + feedback in HUMINT)
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

        // ---------------------------------
        // 🔹 GET CLARIFICATIONS FOR ONE HUMINT
        //    GET /humint/clarification/:humintId
        // ---------------------------------
        getClarificationsByHumint: builder.query({
            query: (humintId) => `/humint/clarification/${humintId}`,
        }),

        // ---------------------------------
        // 🔹 CREATE CLARIFICATION MESSAGE
        //    POST /humint/clarification
        // ---------------------------------
        createClarification: builder.mutation({
            query: ({ humintId, clarificationText }) => ({
                url: "/humint/clarification",
                method: "POST",
                body: { humintId, clarificationText },
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
    // 🔹 new hooks
    useGetClarificationsByHumintQuery,
    useCreateClarificationMutation,
} = humintApi;
