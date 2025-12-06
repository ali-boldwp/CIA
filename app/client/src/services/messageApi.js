import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './apiSlice';

export const messageApi = createApi({
    reducerPath: 'messageApi',
    baseQuery: baseQueryWithReauth,

    tagTypes: ["Messages"],

    endpoints: (builder) => ({


        sendMessage: builder.mutation({
            query: ({ chatId, text }) => ({
                url: `/chats/${chatId}/message`,
                method: "POST",
                body: { text },
            }),
            invalidatesTags: ["Messages"],
        }),


        getMessages: builder.query({
            query: (chatId) => ({
                url: `/chats/${chatId}/messages`,
                method: "GET",
            }),
            providesTags: ["Messages"],
        }),

    }),
});

export const {
    useSendMessageMutation,
    useGetMessagesQuery
} = messageApi;
