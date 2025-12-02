import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const messageApi = createApi({
    reducerPath: 'messageApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        }
    }),

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
