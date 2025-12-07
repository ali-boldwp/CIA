// /src/services/chatApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./apiSlice";

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery,

    endpoints: (builder) => ({

        getMyChats: builder.query({
            query: () => "/chats",
        }),

        // DIRECT 1-to-1 chat (single mode)
        createDirectChat: builder.mutation({
            query: (otherUserId) => ({
                url: "/chats/group",          // jis route pe createGroupChat mounted hai
                method: "POST",
                body: {
                    isGroup: false,
                    users: [otherUserId],
                    groupName: ""
                }
            }),
        }),

        // GROUP chat (multi mode)
        createGroupChat: builder.mutation({
            query: ({ userIds, groupName }) => ({
                url: "/chats/group",
                method: "POST",
                body: {
                    isGroup: true,
                    users: userIds,
                    groupName,
                }
            }),
        }),

    }),
});

export const {
    useGetMyChatsQuery,
    useCreateDirectChatMutation,
    useCreateGroupChatMutation,
} = chatApi;
