import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import baseQuery from './apiSlice';

export const messageApi = createApi({
    reducerPath: 'messageApi',
    baseQuery: baseQuery,

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

        getAuditLogs: builder.query({
            query: (chatId) => `/audit-logs/${chatId}`,
            providesTags: (result, error, chatId) => [
                { type: "Audit", id: chatId }
            ],
        }),

        downloadFile: builder.mutation({
            query: (filename) => ({
                url: `/download/${filename}`,
                method: "GET",
                responseHandler: (response) => response.blob(),
            }),
        }),

    }),
});

export const {
    useGetAuditLogsQuery,
    useSendMessageMutation,
    useGetMessagesQuery,
    useDownloadFileMutation,
} = messageApi;
