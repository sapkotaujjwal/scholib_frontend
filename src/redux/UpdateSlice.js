import { createSlice } from '@reduxjs/toolkit';

export const updateSlice = createSlice({
  name: 'Update',
  initialState: {
    loading: false,
    error: {},
    update: [],
  },
  reducers: {
    GET_UPDATE: (state) => {
      state.loading = true;
    },
    GET_UPDATE_SUCCESS: (state , payload) => {
      state.loading = false;
      state.update = payload;
    },
    GET_UPDATE_FAIL: (state , payload) => {
      state.loading = false;
      state.error = payload;
    },


    POST_UPDATE: (state) => {
      state.loading = true;
    },
    POST_UPDATE_SUCCESS: (state , payload) => {
      state.loading = false;
    },
    POST_UPDATE_FAIL: (state , payload) => {
      state.loading = false;
      state.error = payload;
    },


    // DELETE_UPDATE_SUCCESS: (state, action) => {
    //   const { payload: _id } = action; // Destructure payload from action
    //   const updatedUpdate = state.update.payload.filter(update => update._id !== _id);
    //   return {
    //     ...state,
    //     loading: false,
    //     update: updatedUpdate
    //   };
    // },


    ERROR_REMOVE: (state) =>{
      state.error.payload = null;
    }
  },
});

export const { GET_UPDATE, GET_UPDATE_FAIL ,GET_UPDATE_SUCCESS ,ERROR_REMOVE ,POST_UPDATE ,POST_UPDATE_SUCCESS ,POST_UPDATE_FAIL } = updateSlice.actions;
export default updateSlice.reducer;
