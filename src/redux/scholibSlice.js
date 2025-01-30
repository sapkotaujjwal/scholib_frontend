import { createSlice } from '@reduxjs/toolkit';

export const scholibSlice = createSlice({
  name: 'Scholib',
  initialState: {
    loading: false,
    error: {},
    scholib: [],
  },
  reducers: {
    GET_SCHOLIB: (state) => {
      state.loading = true;
    },
    GET_SCHOLIB_SUCCESS: (state , payload) => {
      state.loading = false;
      state.scholib = payload;
    },
    GET_SCHOLIB_FAIL: (state , payload) => {
      state.loading = false;
      state.error = payload;
    },
    ERROR_REMOVE: (state) =>{
      state.error.payload = null;
    }
  },
});

export const { GET_SCHOLIB, GET_SCHOLIB_FAIL ,GET_SCHOLIB_SUCCESS, ERROR_REMOVE } = scholibSlice.actions;

export default scholibSlice.reducer;
