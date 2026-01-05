// src/services/projectApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from './apiSlice';

export const projectApi = createApi({
    reducerPath: "projectApi",
    baseQuery: baseQuery,
    tagTypes: [ 'Projects' ],
    endpoints: (builder) => ({

        getProjects: builder.query({
            query: (arg = {}) => {
                const { page, limit, search, onlyWithoutHumint, status } = arg;

                const params = {};

                if (page != null) params.page = page;
                if (limit != null) params.limit = limit;
                if (search) params.search = search;
                if (onlyWithoutHumint) params.onlyWithoutHumint = true;

                // ✅ status filter add (approved / finished)
                if (status) params.status = status;

                return {
                    url: "/project",
                    params,
                };
            },
            providesTags: [{ type: "Projects", id: "LIST" }],
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
            query: () => `project-requests/sales`,
        }),

        getRequestedProjectById: builder.query({
            query: (id) => `/getRequestedProjectById/${id}`,
        }),


        updateProject: builder.mutation({
            query: ({ id, data }) => ({
                url: `/project/${id}`,
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
        finalizeProject: builder.mutation({
            query: ({ id }) => ({
                url: `/project/${id}/finished`,
                method: "PATCH",
            }),
        }),
        getAnalystsProgress: builder.query({
            query: () => "/project/analysts/progress",
        }),

        getAnalystsProjectProgress: builder.query({
            query: () => "/project/analysts/project-progress"
        }),
        getProjectFinancialStates: builder.query({
            query: (projectId) => `/project/${projectId}/financial-states`
        })
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
    useFinalizeProjectMutation,
    useGetAnalystsProgressQuery,
    useGetAnalystsProjectProgressQuery,
    useGetProjectFinancialStatesQuery

} = projectApi;
