import { createSlice } from "@reduxjs/toolkit";

export const otherInfoSlice = createSlice({
  name: "Other",
  initialState: {
    date: '',
    staffsDetails: null,
  },
  reducers: {
    SET_DATE: (state, action) => {
      state.date = action.payload
    },
    SET_STAFFS: (state, action) => {
      state.staffsDetails = action.payload
    },
  },
});

export const { SET_DATE, SET_STAFFS } = otherInfoSlice.actions;

export default otherInfoSlice.reducer;
