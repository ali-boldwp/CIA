// src/services/baseQueryWithReauth.js
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL, // e.g. http://localhost:4000/api/v1
    credentials: 'include',
    prepareHeaders: (headers) => {
        // 1) Prefer cookie
        const cookieToken = Cookies.get('accessToken');
        // 2) Fallback to localStorage (since you still save token there)
        const localToken = localStorage.getItem('token');

        const token = cookieToken || localToken;

        if (token) {
            // Use normal "Authorization" casing
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    },
});

const baseQueryWithReauth = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL, // e.g. http://localhost:4000/api/v1
    credentials: 'include',
    prepareHeaders: (headers) => {
        // Prefer cookie
        const cookieToken = Cookies.get('accessToken');
        // Fallback to localStorage (you still store "token" there in Login)
        const localToken = localStorage.getItem('token');

        const token = cookieToken || localToken;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    },
});

export default baseQueryWithReauth;
