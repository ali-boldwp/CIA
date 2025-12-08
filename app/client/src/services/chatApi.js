// /src/services/chatApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./apiSlice";

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery,
    tagTypes: ["Chats"],
    endpoints: (builder) => ({

        getMyChats: builder.query({
            query: () => "/chats",
            providesTags: ["Chats"],
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
        removeMember: builder.mutation({
            query: ({ chatId, userId }) => ({
                url: `/chats/${chatId}/remove-member`,
                method: "POST",
                body: { userId },

            }),
            invalidatesTags: ["Chats"],
        }),
        leaveGroup: builder.mutation({
            query: (chatId) => ({
                url: `/chats/${chatId}/leave`,
                method: "POST",
            }),
            invalidatesTags: ["Chats"], // refresh chats automatically
        }),
        deleteGroup: builder.mutation({
            query: (chatId) => ({
                url: `/chats/${chatId}/delete`,
                method: "DELETE",
            }),
            invalidatesTags: ["Chats"], // auto refresh
        }),

        muteChat: builder.mutation({
            query: ({ chatId, mute }) => ({
                url: `/chats/${chatId}/mute`,
                method: "POST",
                body: { mute },
            }),
            invalidatesTags: ["Chats"],
        }),


        pinChat: builder.mutation({
            query: ({ chatId, pin }) => ({
                url: `/chats/${chatId}/pin`,
                method: "POST",
                body: { pin },  // backend requires boolean
            }),
            invalidatesTags: ["Chats"],
        }),

        addMembersToGroup: builder.mutation({
            query: ({ chatId, users }) => ({
                url: `/chats/${chatId}/add-members`,
                method: "POST",
                body: { users }
            }),
            invalidatesTags: ["Chats", "Users"]
        }),




    }),
});

export const {
    useGetMyChatsQuery,
    useCreateDirectChatMutation,
    useCreateGroupChatMutation,
    useRemoveMemberMutation,
    useLeaveGroupMutation,
    useDeleteGroupMutation,
    useMuteChatMutation,
    usePinChatMutation,
    useAddMembersToGroupMutation,
} = chatApi;
