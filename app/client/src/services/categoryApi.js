import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./apiSlice";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery,
    tagTypes: ["Category",
        "ChapterTemplate",
        "TaskTemplate",
        "FoamFields",],
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
        createFormFields: builder.mutation({
            query: (body) => ({
                url: "/foam-fields",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "FoamFields", id: "LIST" }],
        }),
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

        getTaskTemplatesByChapter: builder.query({
            query: (chapterId) =>
                `/task-template/by-chapter/${chapterId}`,
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
} = categoryApi;
