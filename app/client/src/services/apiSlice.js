// src/services/apiSlice.js
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { logout } from '../features/auth/authSlice';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL, // e.g. http://localhost:4000/api/v1
    // REMOVE credentials: 'include' unless you fixed CORS properly
    prepareHeaders: (headers) => {
        const cookieToken = Cookies.get('accessToken');
        const localToken = localStorage.getItem('token');

        const token = cookieToken || localToken;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    },
});

const baseQueryWithAutoLogout = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result?.error && result.error.status === 401) {
        // 1. Clear tokens
        Cookies.remove('accessToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // 2. Clear Redux auth state
        api.dispatch(logout());

        // 3. Hard redirect to login (simple and reliable)
        window.location.href = '/login';
    }

    return result;
};

export default baseQueryWithAutoLogout;
