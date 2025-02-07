import { createSlice } from '@reduxjs/toolkit';

export const studentAdmissionSlice = createSlice({
  name: 'StudentAdmission',
  initialState: {
    loading: false,
    error: {
    },
    data: [],
  },
  reducers: {
    POST_STUDENT_ADMISSION: (state) => {
      state.loading = true;
    },
    POST_STUDENT_ADMISSION_SUCCESS: (state , payload) => {
      state.loading = false;
      state.data = payload;
    },
    POST_STUDENT_ADMISSION_FAIL: (state , payload) => {
      state.loading = false;
      state.error = payload;
    },
    ERROR_REMOVE: (state) =>{
      state.error.payload = null;
    },
    CLEAR_STUDENT_ADMISSION_DATA: (state) =>{
      state.data = [];
    }
  },
});

export const { POST_STUDENT_ADMISSION, POST_STUDENT_ADMISSION_SUCCESS ,POST_STUDENT_ADMISSION_FAIL, ERROR_REMOVE, CLEAR_STUDENT_ADMISSION_DATA } = studentAdmissionSlice.actions;

export default studentAdmissionSlice.reducer;
