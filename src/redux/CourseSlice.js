import { createSlice } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
  name: "Course",
  initialState: {
    loading: false,
    error: {},
    course: [],
    courseAll: [],
  },
  reducers: {
    GET_COURSE: (state) => {
      state.loading = true;
    },
    GET_COURSE_SUCCESS: (state, payload) => {
      state.loading = false;
      state.course = payload;
    },
    GET_ALL_COURSES_SUCCESS: (state, payload) => {
      state.loading = false;
      state.courseAll = payload;
    },
    GET_COURSE_FAIL: (state, payload) => {
      state.loading = false;
      state.error = payload;
    },
    COURSE_ERROR_REMOVE: (state) => {
      state.error.payload = null;
    },
    UPDATE_COURSE_SECTION: (state, action) => {

      // let newCourse = state.course.paylaod.course.reduce((each)=> each._id !== action.payload.class._id);

      // console.log(action.payload)
    },
    
  },
});

export const {
  GET_COURSE,
  GET_COURSE_FAIL,
  GET_COURSE_SUCCESS,
  COURSE_ERROR_REMOVE,
  GET_ALL_COURSES_SUCCESS,
  UPDATE_COURSE_SECTION,
} = courseSlice.actions;

export default courseSlice.reducer;
