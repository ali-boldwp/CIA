import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        }
    }),

    endpoints: (builder) => ({
        getAnalysts: builder.query({
            query: () => "/users?role=user",
        }),
    }),
});

export const { useGetAnalystsQuery } = userApi;
