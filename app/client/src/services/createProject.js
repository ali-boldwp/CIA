import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from './apiSlice';

export const createdProjectApi = createApi({
    reducerPath: "createdProjectApi",

    baseQuery: baseQuery,

    endpoints: (builder) => ({
        createProject: builder.mutation({
            query: (formData) => ({
                url: "/project", // backend route
                method: "POST",
                body: formData,
            }),
        }),
    }),
});

export const { useCreateProjectMutation } = createdProjectApi;
