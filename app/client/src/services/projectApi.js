// src/services/projectApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectApi = createApi({
    reducerPath: "projectApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_BASE_URL,
        prepareHeaders: (headers) => {
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
        getProjectCreate: builder.query({
            query: () => "/created-project",
        }),
        getProjectRequestById: builder.query({
            query: (id) => `/projects/${id}`,
        }),
        getCreateProjectById: builder.query({
            query: (id) => `/created-project/${id}`,
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

        createChapter: builder.mutation({
            query: ({ name, projectId }) => ({
                url: "/chapter",
                method: "POST",
                body: { name, projectId },
            }),
        }),

        // Get Tasks by chapter
        getTasksByChapterId: builder.query({
            query: (chapterId) => `/task/${chapterId}`,
        }),

        // ✅ New: Create Task
        createTask: builder.mutation({
            query: ({ name, chapterId }) => ({
                url: "/task",
                method: "POST",
                body: { name, chapterId },
            }),
        }),
    }),
});

export const {
    useCreateProjectMutation,
    useGetProjectRequestsQuery,
    useGetProjectCreateQuery,
    useGetCreateProjectByIdQuery,
    useGetProjectRequestByIdQuery,
    useUpdateProjectMutation,
    useUpdateProjectStatusMutation,
    useCreateChapterMutation,
    useGetTasksByChapterIdQuery,
    useCreateTaskMutation, // ✅ export hook
} = projectApi;
