import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from './apiSlice';

export const createdProjectApi = createApi({
    reducerPath: "createdProjectApi",

    baseQuery: baseQueryWithReauth,

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
