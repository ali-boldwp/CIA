// src/services/projectApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from './apiSlice';

export const projectApi = createApi({
    reducerPath: "projectApi",
    baseQuery: baseQuery,
    tagTypes: [ 'Projects' ],
    endpoints: (builder) => ({

        getProjects: builder.query({
            // arg is an object — e.g. { page: 1, limit: 10, search: 'foo' }
            query: (arg = {}) => {
                const { page, limit, search, onlyWithoutHumint , ...rest } = arg;
                const params = {};

                if (page != null)  params.page   = page;
                if (limit != null) params.limit  = limit;
                if (search)       params.search = search;
                if (onlyWithoutHumint) params.onlyWithoutHumint = true;

                // any additional filters can go into rest if needed
                return {
                    url: '/project',
                    params,
                };
            },
            providesTags: [{ type: 'Projects', id: 'LIST' }],
        }),

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
        getProjectRequests: builder.query({
            query: () => "/project-request",
        }),
        getProjectCreate: builder.query({
            query: () => "/project",
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
        getAnalystsProgress: builder.query({
            query: () => "/project/analysts/progress"
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useGetProjectCreateQuery,
    useCreateProjectMutation,
    useRequestProjectMutation,
    useGetAllRequestedProjectsQuery,
    useGetRequestedProjectByIdQuery,
    useGetProjectRequestsQuery,
    useGetChapterByIdQuery,
    useGetCreateProjectByIdQuery,
    useUpdateProjectMutation,
    useCreateChapterMutation,
    useGetTasksByChapterIdQuery,
    useCreateTaskMutation,
    useGetAnalystsProgressQuery,
    useGetAnalystsProgress

} = projectApi;
