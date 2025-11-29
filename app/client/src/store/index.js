// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { projectApi } from "../services/projectApi";
import { employeeApi } from '../services/EmployeesApi';
import { authApi } from "../services/authApi";   // ⬅ ADD THIS
import { createdProjectApi } from "../services/createProject";
import { userApi } from "../services/userApi";
import { analystApi } from "../services/analystApi";

const store = configureStore({
    reducer: {
        auth: authReducer,
        // RTK Query reducers MUST be added
        [projectApi.reducerPath]: projectApi.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [createdProjectApi.reducerPath]: createdProjectApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [analystApi.reducerPath]: analystApi.reducer,

    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            projectApi.middleware,
            employeeApi.middleware,
            authApi.middleware,
            createdProjectApi.middleware,
            userApi.middleware,
            analystApi.middleware
        ),
});

export default store;
