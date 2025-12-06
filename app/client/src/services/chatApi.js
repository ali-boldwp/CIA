import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from './apiSlice';

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: baseQueryWithReauth,

    endpoints: (builder) => ({

        getMyChats: builder.query({
            query: () => "/chats",
        }),

    }),
});

export const { useGetMyChatsQuery } = chatApi;
