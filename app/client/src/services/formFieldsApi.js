import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./apiSlice";

export const foamFieldsApi = createApi({
    reducerPath: "foamFieldsApi",
    baseQuery: baseQuery,
    tagTypes: ["FoamFields"],
    endpoints: (builder) => ({
        // ✅ Get Foam Fields by Task ID
        getFoamFieldsByTaskId: builder.query({
            query: (taskId) => `/foam-fields/by-task/${taskId}`,
            providesTags: ["FoamFields"],
        }),

        // ✅ Add Table Column
        addTableColumn: builder.mutation({
            query: ({ fieldId, data }) => ({
                url: `/foam-fields/${fieldId}/columns`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["FoamFields"],
        }),

        // ✅ Update Table Column
        updateTableColumn: builder.mutation({
            query: ({ fieldId, columnId, data }) => ({
                url: `/foam-fields/${fieldId}/columns/${columnId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["FoamFields"],
        }),

        // ✅ Delete Table Column
        deleteTableColumn: builder.mutation({
            query: ({ fieldId, columnId }) => ({
                url: `/foam-fields/${fieldId}/columns/${columnId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FoamFields"],
        }),
    }),
});

export const {
    useGetFoamFieldsByTaskIdQuery,
    useAddTableColumnMutation,
    useUpdateTableColumnMutation,
    useDeleteTableColumnMutation,
} = foamFieldsApi;
