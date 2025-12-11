// src/services/projectApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from './apiSlice';

export const taskApi = createApi({
    reducerPath: "taskApi",
    baseQuery: baseQuery,
    tagTypes: [ 'Projects' ],
    endpoints: (builder) => ({
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


        startTask: builder.mutation({
            query: (taskId) => ({
                url: `/task/${taskId}/start`,
                method: "POST",
            }),
        }),

        pauseTask: builder.mutation({
            query: (id) => ({
                url: `/task/${id}/pause`,
                method: "POST",
            }),
        }),
        resumeTask: builder.mutation({
            query: (id) => ({
                url: `/task/${id}/resume`,
                method: "POST",
            }),
        }),
        completeTask: builder.mutation({
            query: (id) => ({
                url: `/task/${id}/complete`,
                method: "POST",
            }),
        }),

        finalizeTask: builder.mutation({
            query: ({ id, status }) => ({
                url: `/project/${id}/status`,
                method: "PUT",
                body: { status },
            }),
        }),


        updateEditable: builder.mutation({
            query: ({ projectId, isEditable }) => ({
                url: `/project/${projectId}/editable`,
                method: "PUT",
                body: { isEditable }
            }),
            invalidatesTags: ["Project"]
        }),
        createObservation: builder.mutation({
            query: ({ projectId, text }) => ({
                url: `/observation`,
                method: "POST",
                body: { projectId, text },
            }),
            invalidatesTags: (result, error, arg) =>
                result ? [{ type: "Project", id: arg.projectId }, { type: "Observation", id: "LIST" }] : [],
        }),

        getObservationsByProject: builder.query({
            query: (projectId) => `/observation/project/${projectId}`,
            providesTags: (result, error, projectId) =>
                result ? [{ type: "Observation", id: "LIST" }] : [],
        }),


    }),
});

export const {

    useGetChapterByIdQuery,
    useCreateChapterMutation,
    useGetTasksByChapterIdQuery,
    useCreateTaskMutation, // ✅ export hook
    useStartTaskMutation,
    usePauseTaskMutation,
    useResumeTaskMutation,
    useCompleteTaskMutation,
    useUpdateEditableMutation,
    useFinalizeTaskMutation,
    useCreateObservationMutation,
    useGetObservationsByProjectQuery
} = taskApi;
