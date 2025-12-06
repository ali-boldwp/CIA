import { createSlice } from '@reduxjs/toolkit';

// -------- Restore session from localStorage --------
let savedUser = null;

try {
    const stored = localStorage.getItem("user");
    savedUser = stored ? JSON.parse(stored) : null;
} catch (e) {
    console.warn("Failed to parse stored user:", e);
    savedUser = null;
    localStorage.removeItem("user");
}

// -------- Initial State --------
const initialState = {
    user: savedUser,
};

// -------- Slice --------
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        clearUser(state) {
            state.user = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    },
});

export const { setUser, clearUser, logout } = authSlice.actions;
export default authSlice.reducer;
