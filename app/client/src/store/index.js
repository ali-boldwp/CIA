// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { projectApi } from "../services/projectApi";
import { employeeApi } from '../services/EmployeesApi';
import { authApi } from "../services/authApi";   // ⬅ ADD THIS

const store = configureStore({
    reducer: {
        auth: authReducer,

        // RTK Query reducers MUST be added
        [projectApi.reducerPath]: projectApi.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
        [authApi.reducerPath]: authApi.reducer,   // ⬅ ADD THIS
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            projectApi.middleware,
            employeeApi.middleware,
            authApi.middleware,  // ⬅ ADD THIS
        ),
});

export default store;
