import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: {
        users: {
            allUsers: null,
            isFetching: false,
            error: false,
        },
        message:"",
    },
    reducers: {
        getUsersStart: (state) => {
            state.users.isFetching = true;
        },
        getUsersSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.allUsers = action.payload;
        },
        getUsersFail: (state, action) => {
            state.users.isFetching = false;
            state.users.error = true;
        },
        deleteUserStart: (state) => {
            state.users.isFetching = true;
        },
        deleteUserSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.error = false;
            state.message = action.payload;
        },
        deleteUserFail: (state, action) => {
            state.users.isFetching = false;
            state.users.error = true;
            state.message = action.payload;
        },
    }
})
export const {
    getUsersStart,
    getUsersSuccess,
    getUsersFail,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFail,
} = userSlice.actions;
export const userReducer =  userSlice.reducer;