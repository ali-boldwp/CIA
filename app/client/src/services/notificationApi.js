import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from './apiSlice';
export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery:  baseQuery,

    tagTypes: ["Notifications"],

    endpoints: (builder) => ({

        // 1️⃣ GET ALL USER NOTIFICATIONS
        getNotifications: builder.query({
            query: ({ page = 1, limit = 20 }) =>
                `/notification?page=${page}&limit=${limit}`,
            providesTags: ["Notifications"],
        }),

        // 2️⃣ GET COUNT OF UNSEEN NOTIFICATIONS
        getUnseenCount: builder.query({
            query: () => `/notification/unseen`,
            providesTags: ["Notifications"],
        }),

        // 3️⃣ MARK ONE AS SEEN
        markAsSeen: builder.mutation({
            query: (id) => ({
                url: `/notification/seen/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Notifications"],
        }),


    })
});

export const {
    useGetNotificationsQuery,
    useGetUnseenCountQuery,
    useMarkAsSeenMutation,
} = notificationApi;
