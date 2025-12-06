import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from './apiSlice';

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: baseQuery,

    endpoints: (builder) => ({

        getMyChats: builder.query({
            query: () => "/chats",
        }),

    }),
});

export const { useGetMyChatsQuery } = chatApi;
