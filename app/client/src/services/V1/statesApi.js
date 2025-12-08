import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../apiSlice";

export const statsApi = createApi({
    reducerPath: "statsApi",
    baseQuery: baseQuery,
    tagTypes: [ "stats" ],

    endpoints: (builder) => ({

        getStats: builder.query({
            query: () => "/stats",
            providesTags: ["Analysts"],
        }),

    })

});

export const {
    useGetStatsQuery
} = statsApi;

export default statsApi;