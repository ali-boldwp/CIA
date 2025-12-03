// src/services/projectApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectApi = createApi({
    reducerPath: "projectApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        createProject: builder.mutation({
            query: (formData) => ({
                url: "/projects",
                method: "POST",
                body: formData,
            }),
        }),
        getProjectRequests: builder.query({
            query: () => "/projects",
        }),
        getProjectRequestById: builder.query({
            query: (id) => `/projects/${id}`,
        }),
        updateProject: builder.mutation({
            query: ({ id, data }) => ({
                url: `/projects/${id}/approve`,
                method: "PUT",
                body: data,
            }),
        }),
        updateProjectStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/projects/${id}/status`,
                method: "PATCH",
                body: status,
            }),
        }),

        // ✅ Add chapter creation endpoint
        createChapter: builder.mutation({
            query: ({ name, projectId }) => ({
                url: "/chapter",
                method: "POST",
                body: { name, projectId },
            }),
        }),
    }),
});

export const {
    useCreateProjectMutation,
    useGetProjectRequestsQuery,
    useGetProjectRequestByIdQuery,
    useUpdateProjectMutation,
    useUpdateProjectStatusMutation,
    useCreateChapterMutation, // ✅ Export the new hook
} = projectApi;
