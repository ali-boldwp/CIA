import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./apiSlice";

export const humintExpanseApi = createApi({
    reducerPath: "humintExpanseApi",
    baseQuery: baseQuery,
    tagTypes: ["HumintExpanse"],

    endpoints: (builder) => ({
        // CREATE EXPENSE
        createHumintExpanse: builder.mutation({
            query: (body) => ({
                url: `/humint-expanse`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["HumintExpanse"],
        }),

        // GET ALL EXPENSES
        getHumintExpenses: builder.query({
            query: (project) => ({
                url: `/humint-expanse?project=${project}`,
                method: "GET",
            }),
            providesTags: ["HumintExpanse"],
        }),

        // GET EXPENSE BY ID
        getHumintExpenseById: builder.query({
            query: ({ id, project }) => ({
                url: `/humint-expanse/${id}?project=${project}`,
                method: "GET",
            }),
            providesTags: ["HumintExpanse"],
        }),

        // UPDATE (project must go in body)
        updateHumintExpanse: builder.mutation({
            query: ({ id, project, ...body }) => ({
                url: `/humint-expanse/${id}`,
                method: "PUT",
                body: { project, ...body },
            }),
            invalidatesTags: ["HumintExpanse"],
        }),

        // DELETE (project in query)
        deleteHumintExpanse: builder.mutation({
            query: ({ id, project }) => ({
                url: `/humint-expanse/${id}?project=${project}`,
                method: "DELETE",
            }),
            invalidatesTags: ["HumintExpanse"],
        }),

        // TOTALS (PROJECT WISE ✅ FIX)
        getHumintTotals: builder.query({
            query: (project) => ({
                url: `/humint-expanse/totals/grouped?project=${project}`,
                method: "GET",
            }),
            providesTags: ["HumintExpanse"],
        }),

        // GET PROJECT ANALYST EXPENSE
        getProjectAnalystExpanse: builder.query({
            query: (projectId) => ({
                url: `/analyst/${projectId}/analyst-expanse`,
                method: "GET",
            }),
            providesTags: ["HumintExpanse"],
        }),

        // GET ANALYST FINAL SALARY
        getAnalystsFinalSalary: builder.query({
            query: () => ({
                url: `/analyst-expanse/total-salary`,
                method: "GET",
            }),
            providesTags: ["HumintExpanse"],
        }),

         // UPDATE PROJECT PRICE
        updateProjectPrice: builder.mutation({
            query: ({ projectId, type, price }) => ({
                url: `/project/${projectId}/price/${type}`,
                method: "PUT",
                body: { price },
            }),
            invalidatesTags: ["ProjectStats"],
        }),
    }),
});

export const {
    useCreateHumintExpanseMutation,
    useGetHumintExpensesQuery,
    useGetHumintExpenseByIdQuery,
    useUpdateHumintExpanseMutation,
    useDeleteHumintExpanseMutation,
    useGetHumintTotalsQuery,
    useGetProjectAnalystExpanseQuery,
    useGetAnalystsFinalSalaryQuery,
    useUpdateProjectPriceMutation,
} = humintExpanseApi;