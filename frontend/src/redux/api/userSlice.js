import { createSlice } from '@reduxjs/toolkit';

const item = localStorage.getItem('userData');
const token = localStorage.getItem('accessToken');
const initialState = {
    // Parse the item if it exists, or default to null
    user: item ? JSON.parse(item) : null,
    token: token
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
        },
        setUser: (state, action) => {
            if (action.payload.user) {
                state.user = action.payload.user;
            }
            if (action.payload.token) {
                state.token = action.payload.token;
            }
        }
    }
});

export default userSlice.reducer;

export const { logout, setUser } = userSlice.actions;
