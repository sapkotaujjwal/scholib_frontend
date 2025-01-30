import { createSlice } from '@reduxjs/toolkit';

export const bigImageSlice = createSlice({
  name: 'BigImage',
  initialState: {
    bigImage: false,
    index: 0,
    data: [],
  },
  reducers: {
    SET_BIGIMAGE: (state, action) => {
      state.bigImage = true;
      state.index = action.payload.index;
      state.data = action.payload.data;
    },
    REMOVE_BIGIMAGE: (state) => {
      state.bigImage = false;
      state.index = 0;
      state.data = [];
    },
  },
});

export const { SET_BIGIMAGE, REMOVE_BIGIMAGE } = bigImageSlice.actions;

export default bigImageSlice.reducer;
