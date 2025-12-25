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



    }),
});

export const {

    useGetFoamFieldsByTaskIdQuery,

} = foamFieldsApi;
