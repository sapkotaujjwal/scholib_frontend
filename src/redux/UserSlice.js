import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "User",
  initialState: {
    loading: false,
    error: {},
    user: [],
    user0: [],
  },
  reducers: {
    GET_USER: (state) => {
      state.loading = true;
    },
    GET_USER_SUCCESS: (state, payload) => {
      state.loading = false;
      state.user = payload;
      state.user0 = payload;
    },
    GET_USER_FAIL: (state, payload) => {
      state.loading = false;
      state.error = payload;
    },
    LOGOUT_USER_SUCCESS: (state, payload) => {
      let tokens = state.user.payload.tokens.filter(
        (tok) => tok._id !== payload.payload
      );

      state.loading = false;
      state.user.payload.tokens = tokens;
      state.error = {};
    },
    LOGOUT_ME_SUCCESS: (state, payload) => {
      state.loading = false;
      state.user = [];
      state.error = {};
    },
    ANOTHER_SCHOOL_OPEN: (state, payload) => {
      state.user = [];
    },
    SAME_SCHOOL_OPEN: (state, payload) => {
      state.user = state.user0;
    },
    ERROR_REMOVE: (state) => {
      state.loading = false;
      state.error.payload = null;
    },
  },
});

export const {
  GET_USER,
  GET_USER_FAIL,
  GET_USER_SUCCESS,
  ERROR_REMOVE,
  LOGOUT_ME_SUCCESS,
  ANOTHER_SCHOOL_OPEN,
  SAME_SCHOOL_OPEN,
  LOGOUT_USER_SUCCESS,
} = userSlice.actions;

export default userSlice.reducer;
