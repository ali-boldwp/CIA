import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./apiSlice";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery,
    tagTypes: ["Category", "ChapterTemplate", "TaskTemplate", "FoamFields", "CategoryPreview"],
    endpoints: (builder) => ({
        // ================= GET ALL CATEGORIES =================
        getCategories: builder.query({
            query: () => ({
                url: "/category",
                method: "GET",
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map((cat) => ({
                            type: "Category",
                            id: cat._id,
                        })),
                        { type: "Category", id: "LIST" },
                    ]
                    : [{ type: "Category", id: "LIST" }],
        }),

        // ================= CREATE CATEGORY =================
        createCategory: builder.mutation({
            query: (body) => ({
                url: "/category",
                method: "POST",
                body, // { name, status }
            }),
            invalidatesTags: [{ type: "Category", id: "LIST" }],
        }),

        // ================= GET CATEGORY BY ID =================
        getCategoryById: builder.query({
            query: (id) => ({
                url: `/category/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Category", id }],
        }),

        // ================= UPDATE CATEGORY =================
        updateCategory: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/category/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Category", id: arg.id },
                { type: "Category", id: "LIST" },
            ],
        }),

        // ================= CREATE CHAPTER TEMPLATE =================
        createChapterTemplate: builder.mutation({
            query: (body) => ({
                url: "/chapter-template",
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, body) => [
                { type: "ChapterTemplate", id: `LIST-${body.category}` },
            ],
        }),

        // ================= GET CHAPTER TEMPLATES BY CATEGORY =================
        getChapterTemplatesByCategory: builder.query({
            query: (categoryId) => `/chapter-template/by-category/${categoryId}`,
            providesTags: (result, error, categoryId) =>
                result?.data
                    ? [
                        ...result.data.map((ch) => ({ type: "ChapterTemplate", id: ch._id })),
                        { type: "ChapterTemplate", id: `LIST-${categoryId}` },
                    ]
                    : [{ type: "ChapterTemplate", id: `LIST-${categoryId}` }],
        }),

        // ================= CREATE TASK TEMPLATE =================
        createTaskTemplate: builder.mutation({
            query: (body) => ({
                url: "/task-template",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "TaskTemplate", id: "LIST" }],
        }),

        // ================= UPDATE TASK TEMPLATE =================
        updateTaskTemplate: builder.mutation({
            query: ({ id, data }) => ({
                url: `/task-template/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "TaskTemplate", id: arg.id },
                { type: "TaskTemplate", id: "LIST" },
            ],
        }),

        // ================= CREATE FORM FIELDS =================
        createFormFields: builder.mutation({
            query: (body) => ({
                url: "/foam-fields",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "FoamFields", id: "LIST" }],
        }),

        // ================= GET FOAM FIELDS BY TASK =================
        getFoamFieldsByTask: builder.query({
            query: (taskId) => `/foam-fields/by-task/${taskId}`,
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map((field) => ({
                            type: "FoamFields",
                            id: field._id,
                        })),
                        { type: "FoamFields", id: "LIST" },
                    ]
                    : [{ type: "FoamFields", id: "LIST" }],
        }),

        // ================= GET TASK TEMPLATES BY CHAPTER =================
        getTaskTemplatesByChapter: builder.query({
            query: (chapterId) => `/task-template/by-chapter/${chapterId}`,
        }),

        // ================= UPDATE CHAPTER TEMPLATE =================
        updateChapterTemplate: builder.mutation({
            query: ({ id, data }) => ({
                url: `/chapter-template/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "ChapterTemplate", id: arg.id },
                { type: "ChapterTemplate", id: `LIST-${arg.data.category}` },
            ],
        }),

        // ================= UPDATE CHAPTER TEMPLATE INDEX =================
        updateChapterTemplateIndex: builder.mutation({
            query: ({ id, data }) => ({
                url: `/category/${id}/update-index`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: [{ type: "Category", id: "LIST" }],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation,
    useGetFoamFieldsByTaskQuery,
    useCreateFormFieldsMutation,
    useGetChapterTemplatesByCategoryQuery,
    useCreateChapterTemplateMutation,
    useGetTaskTemplatesByChapterQuery,
    useCreateTaskTemplateMutation,
    useUpdateTaskTemplateMutation,
    useUpdateChapterTemplateMutation,
    useUpdateChapterTemplateIndexMutation,
} = categoryApi;
