import { createSlice } from '@reduxjs/toolkit';

export const gallerySlice = createSlice({
  name: 'Gallery',
  initialState: {
    loading: false,
    error: {},
    gallery: [],
  },
  reducers: {
    GET_GALLERY: (state) => {
      state.loading = true;
    },
    GET_GALLERY_SUCCESS: (state , payload) => {
      state.loading = false;

      // const oldGalleryData = [...state.gallery];
      // state.gallery = [...oldGalleryData, ...payload.payload];


      state.gallery = payload.payload;
    },
    GET_GALLERY_FAIL: (state , payload) => {
      state.loading = false;
      state.error = payload;
    },
    POST_GALLERY: (state) => {
      state.loading = true;
    },
    POST_GALLERY_SUCCESS: (state , payload) => {
      state.loading = false;
    },
    POST_GALLERY_FAIL: (state , payload) => {
      state.loading = false;
      state.error = payload;
    },


    ERROR_REMOVE: (state) =>{
      state.error.payload = null;
    },

    DELETE_GALLERY_IMAGE: (state, payload) =>{
      const id = payload.payload;

      const oldGalleryData = [...state.gallery];
      state.gallery = oldGalleryData.filter((obj)=>{
        return obj._id !== id;
      })

    }
  },
});

export const { GET_GALLERY, DELETE_GALLERY_IMAGE, GET_GALLERY_FAIL ,GET_GALLERY_SUCCESS ,ERROR_REMOVE ,POST_GALLERY ,POST_GALLERY_SUCCESS ,POST_GALLERY_FAIL } = gallerySlice.actions;
export default gallerySlice.reducer;
