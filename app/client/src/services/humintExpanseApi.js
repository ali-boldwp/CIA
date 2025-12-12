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
            query: () => ({
                url: `/humint-expanse`,
                method: "GET",
            }),
            providesTags: ["HumintExpanse"],
        }),

        // GET EXPENSE BY ID
        getHumintExpenseById: builder.query({
            query: (id) => ({
                url: `/humint-expanse/${id}`,
                method: "GET",
            }),
            providesTags: ["HumintExpanse"],
        }),

        // UPDATE
        updateHumintExpense: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/humint-expanse/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["HumintExpanse"],
        }),

        // DELETE
        deleteHumintExpense: builder.mutation({
            query: (id) => ({
                url: `/humint-expanse/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["HumintExpanse"],
        }),

        // GET TOTAL RON / EUR / USD
        getHumintTotals: builder.query({
            query: () => ({
                url: `/humint-expanse/totals/grouped`,
                method: "GET",
            }),
            providesTags: ["HumintExpanse"],
        }),

        // ✅ NEW: GET PROJECT ANALYST EXPENSE (Tumhari working API)
        getProjectAnalystExpanse: builder.query({
            query: (projectId) => ({
                url: `/analyst/${projectId}/analyst-expanse`,
                method: "GET",
            }),
            providesTags: ["HumintExpanse"],
        }),

        // ✅ NEW: GET ANALYST FINAL SALARY (Agar chahiye toh)
        getAnalystsFinalSalary: builder.query({
            query: () => ({
                url: `/analyst-expanse/total-salary`,
                method: "GET",
            }),
            providesTags: ["HumintExpanse"],
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
    // ✅ NEW HOOKS
    useGetProjectAnalystExpanseQuery,
    useGetAnalystsFinalSalaryQuery,
} = humintExpanseApi;