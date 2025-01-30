import { createSlice } from "@reduxjs/toolkit";

export const confirmGlobalSlice = createSlice({
  name: "ConfirmGlobal",
  initialState: {
    confirmGlobal: false,
    data: {},
    status: null,
  },
  reducers: {
    SET_CONFIRM_GLOBAL: (state, action) => {
      state.confirmGlobal = true;
      state.data = action.payload;
    },
    ACCEPT_CONFIRM_GLOBAL: (state, action) => {
        state.status = 'accepted';
    },
    DECLINE_CONFIRM_GLOBAL: (state, action) => {
        state.status = 'declined';
    },
    REMOVE_CONFIRM_GLOBAL: (state) => {
      state.confirmGlobal = false;
      state.data = [];
      state.status = null;
    },
  },
});

export const { SET_CONFIRM_GLOBAL, REMOVE_CONFIRM_GLOBAL, ACCEPT_CONFIRM_GLOBAL,DECLINE_CONFIRM_GLOBAL  } =
  confirmGlobalSlice.actions;

export default confirmGlobalSlice.reducer;
