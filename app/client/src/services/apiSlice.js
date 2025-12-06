// src/services/apiSlice.js
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL, // e.g. http://localhost:4000/api/v1
    credentials: 'include',
    prepareHeaders: (headers) => {
        // Prefer cookie
        const cookieToken = Cookies.get('accessToken');
        // Fallback to localStorage (you still store "token" there in Login)
        const localToken = localStorage.getItem('token');

        const token = cookieToken || localToken;

        console.log('💬 baseQuery token:', token); // TEMP LOG – helps debugging

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    },
});

export default baseQuery;
