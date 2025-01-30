import { createSlice } from "@reduxjs/toolkit";

export const studentsSlice = createSlice({
  name: "Students",
  initialState: {
    loading: false,
    error: {},
    students: [],
    allStudents:[],
  },
  reducers: {
    GET_STUDENTS: (state) => {
      state.loading = true;
    },
    GET_STUDENTS_SUCCESS: (state, payload) => {
      state.loading = false;
      state.students = payload;
    },
    GET_STUDENTS_FAIL: (state, payload) => {
      state.loading = false;
      state.error = payload;
    },
    ERROR_REMOVE: (state) => {
      state.loading = false;
      state.error.payload = null;
    },

    EDIT_STUDENT_COURSE: (state, action) => {
      state.students.payload.map((std) => {
        if (std._id === action.payload._id) {
          std.course = action.payload.course;
        }
      });
    },
  },
});

export const {
  GET_STUDENTS,
  GET_STUDENTS_FAIL,
  GET_STUDENTS_SUCCESS,
  ERROR_REMOVE,
  EDIT_STUDENT_COURSE,
} = studentsSlice.actions;

export default studentsSlice.reducer;
