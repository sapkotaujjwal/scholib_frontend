import { createSlice } from '@reduxjs/toolkit';

export const createCourseSlice = createSlice({
  name: 'CreateCourse',
  initialState: {
    loading: false,
    error: {},
    data: [],
  },
  reducers: {
    POST_CREATE_COURSE: (state) => {
      state.loading = true;
    },
    POST_CREATE_COURSE_SUCCESS: (state , payload) => {
      state.loading = false;
      state.data = payload;
    },
    POST_CREATE_COURSE_FAIL: (state , payload) => {
      state.loading = false;
      state.error = payload;
    },
    ERROR_REMOVE: (state) =>{
      state.error.payload = null;
    }
  },
});

export const { POST_CREATE_COURSE, POST_CREATE_COURSE_SUCCESS ,POST_CREATE_COURSE_FAIL, ERROR_REMOVE } = createCourseSlice.actions;

export default createCourseSlice.reducer;
