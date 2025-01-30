import { createSlice } from "@reduxjs/toolkit";

export const studentDataSlice = createSlice({
  name: "StudentData",
  initialState: {
    loading: false,
    error: {},
    studentData: {},
  },
  reducers: {
    GET_STUDENTDATA: (state) => {
      state.loading = true;
    },
    GET_STUDENTDATA_SUCCESS: (state, payload) => {
      state.loading = false;
      state.studentData = payload;
    },
    GET_STUDENTDATA_FAIL: (state, payload) => {
      state.loading = false;
      state.error = payload;
    },
    ERROR_REMOVE: (state) => {
      state.loading = false;
      state.error.payload = null;
    },
  },
});

export const {
  GET_STUDENTDATA,
  GET_STUDENTDATA_FAIL,
  GET_STUDENTDATA_SUCCESS,
  ERROR_REMOVE,
} = studentDataSlice.actions;

export default studentDataSlice.reducer;
