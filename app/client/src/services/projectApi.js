// src/services/projectApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectApi = createApi({
    reducerPath: "projectApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        createProject: builder.mutation({
            query: (formData) => ({
                url: "projects",
                method: "POST",
                body: formData,
            }),
        }),
    }),
});

export const { useCreateProjectMutation } = projectApi;
