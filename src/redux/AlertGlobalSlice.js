import { createSlice } from '@reduxjs/toolkit';

export const alertGlobalSlice = createSlice({
  name: 'AlertGlobal',
  initialState: {
    alertGlobal: false,
    data: {},
  },
  reducers: {
    SET_ALERT_GLOBAL: (state, action) => {
      state.alertGlobal = true;
      state.data = action.payload;
    },
    REMOVE_ALERT_GLOBAL: (state) => {
      state.alertGlobal = false;
      state.data = [];
    },
  },
});

export const { SET_ALERT_GLOBAL, REMOVE_ALERT_GLOBAL } = alertGlobalSlice.actions;

export default alertGlobalSlice.reducer;
