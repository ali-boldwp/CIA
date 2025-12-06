import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import baseQuery from './apiSlice';

export const employeeApi = createApi({
    reducerPath: 'employeeApi',
    baseQuery: baseQuery,


    tagTypes: ["Employees"],  // 🏷 enables auto-refetch

    endpoints: (builder) => ({

        // CREATE EMPLOYEE
        createEmployee: builder.mutation({
            query: (newEmployee) => ({
                url: "/employees",
                method: "POST",
                body: newEmployee,
            }),
            invalidatesTags: ["Employees"],  // auto refresh list
        }),

        // GET ALL EMPLOYEES
        getAllEmployees: builder.query({
            query: () => ({
                url: "/employees",
                method: "GET",
            }),
            providesTags: ["Employees"],
        }),

        // UPDATE EMPLOYEE
        updateEmployee: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/employees/${id}`,
                method: "PUT",
                body: updatedData,
            }),
            invalidatesTags: ["Employees"],
        }),

        // DELETE EMPLOYEE
        deleteEmployee: builder.mutation({
            query: (id) => ({
                url: `/employees/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Employees"],
        }),

    }),
});

export const {
    useCreateEmployeeMutation,
    useGetAllEmployeesQuery,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation
} = employeeApi;
