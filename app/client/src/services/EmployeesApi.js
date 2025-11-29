import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const employeeApi = createApi({
    reducerPath: 'employeeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1",
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("token");

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        }
    }),


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
