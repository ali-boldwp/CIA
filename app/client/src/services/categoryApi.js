import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./apiSlice";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery,
    tagTypes: ["Category"],
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

        getCategoryById: builder.query({
            query: (id) => ({
                url: `/category/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [
                { type: "Category", id },
            ],
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
        createChapterTemplate: builder.mutation({
            query: (body) => ({
                url: "/chapter-template",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "ChapterTemplate", id: "LIST" }],
        }),
        getChapterTemplatesByCategory: builder.query({
            query: (categoryId) =>
                `/chapter-template/by-category/${categoryId}`,
        }),
        createTaskTemplate: builder.mutation({
            query: (body) => ({
                url: "/task-template",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "TaskTemplate", id: "LIST" }],
        }),

        updateTaskTemplate: builder.mutation({
            query: ({ id, data }) => ({
                url: `/task-template/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Task"]
        }),

        createFormFields: builder.mutation({
            query: (body) => ({
                url: "/foam-fields",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "FoamFields", id: "LIST" }],
        }),
        getTaskTemplatesByChapter: builder.query({
            query: (chapterId) =>
                `/task-template/by-chapter/${chapterId}`,
        }),

        updateChapterTemplate: builder.mutation({
            query: ({ id, data }) => ({
                url: `/chapter-template/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Category"]
        })



    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation,
    useCreateFormFieldsMutation,
    useGetChapterTemplatesByCategoryQuery,
    useCreateChapterTemplateMutation,
    useGetTaskTemplatesByChapterQuery,
    useCreateTaskTemplateMutation,
    useUpdateTaskTemplateMutation,
    useUpdateChapterTemplateMutation,
} = categoryApi;
