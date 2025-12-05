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
        tagTypes: ["Chapters"],
    }),

    endpoints: (builder) => ({
        createProject: builder.mutation({
            query: (formData) => ({
                url: "/project",
                method: "POST",
                body: formData,
            }),
        }),

        requestProject: builder.mutation({
            query: (formData) => ({
                url: "/project-request",
                method: "POST",
                body: formData,
            }),
        }),
        getProjects:builder.query({
            query: () => "/project",
        }),
        getProjectRequests: builder.query({
            query: () => "/project-request",
        }),
        getProjectCreate: builder.query({
            query: () => "/project",
        }),

        getProjectProgress: builder.query({
            query: (projectId) => `/project/${projectId}/progress`,
        }),

        getProjectRequestById: builder.query({
            query: (id) => `/project-request/${id}`,
        }),
        getCreateProjectById: builder.query({
            query: (id) => `/project/${id}`,
        }),

        getAllRequestedProjects: builder.query({
            query: () => `/getAllRequestedProjects`,
        }),

        getRequestedProjectById: builder.query({
            query: (id) => `/getRequestedProjectById/${id}`,
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
            invalidatesTags: ["Chapters"],
        }),

        getChapterById: builder.query({
            query: (id) => `/chapter/${id}`,
            providesTags: ["Chapters"],
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
    useRequestProjectMutation,
    useGetProjectsQuery,
    useGetAllRequestedProjectsQuery,
    useGetRequestedProjectByIdQuery,
    useGetProjectRequestsQuery,
    useGetProjectCreateQuery,
    useGetChapterByIdQuery,
    useGetProjectProgressQuery,
    useGetCreateProjectByIdQuery,
    useGetProjectRequestByIdQuery,
    useUpdateProjectMutation,
    useUpdateProjectStatusMutation,
    useCreateChapterMutation,
    useGetTasksByChapterIdQuery,
    useCreateTaskMutation, // ✅ export hook
} = projectApi;
