import { createSlice } from '@reduxjs/toolkit';

export const updateSchoolSlice = createSlice({
  name: 'UpdateSchool',
  initialState: {
    loading: false,
    error: {},
    data: [],
  },
  reducers: {
    POST_UPDATE_SCHOOL: (state) => {
      state.loading = true;
    },
    POST_UPDATE_SCHOOL_SUCCESS: (state , payload) => {
      state.loading = false;
      state.data = payload;
    },
    POST_UPDATE_SCHOOL_FAIL: (state , payload) => {
      state.loading = false;
      state.error = payload;
    },
    ERROR_REMOVE: (state) =>{
      state.error.payload = null;
    }
  },
});

export const { POST_UPDATE_SCHOOL, POST_UPDATE_SCHOOL_SUCCESS ,POST_UPDATE_SCHOOL_FAIL, ERROR_REMOVE } = updateSchoolSlice.actions;

export default updateSchoolSlice.reducer;
