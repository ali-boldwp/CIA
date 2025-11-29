import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const createdProjectApi = createApi({
    reducerPath: "createdProjectApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_BASE_URL, // http://localhost:4000/api/v1
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),

    endpoints: (builder) => ({
        createProject: builder.mutation({
            query: (formData) => ({
                url: "/created-project", // backend route
                method: "POST",
                body: formData,
            }),
        }),
    }),
});

export const { useCreateProjectMutation } = createdProjectApi;
