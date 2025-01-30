import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
  name: "Home",
  initialState: {
    loading: false,
    error: {},
    school: {},
    staffs2: null,
    accounts: [],
  },
  reducers: {
    GET_SCHOOL: (state) => {
      state.loading = true;
    },

    GET_SCHOOL_SUCCESS: (state, payload) => {
      state.loading = false;

      // state.staffs2 = payload.payload.staffs.filter((int) => int.removedOn);
      // state.school = payload;

      state.staffs2 = payload.payload.staffs.filter((int) => int.removedOn);
      state.school = {
        ...payload,
        payload: {
          ...payload.payload,
          staffs: payload.payload.staffs.filter((int) => !int.removedOn),
        },
      };
    },

    GET_SCHOOL_FAIL: (state, payload) => {
      state.loading = false;
      state.error = payload;
    },

    SET_SCHOOL_ADMISSIONS: (state, action) => {
      state.school.payload.admissions = action.payload;
    },

    AFTER_ADMISSION_WORK: (state, action) => {
      const updatedAdmission = state.school.payload.admissions.filter(
        (adm) => adm._id !== action.payload
      );
      state.school.payload.admissions = updatedAdmission;
    },

    DELETE_SCHOOL_BUS: (state, action) => {
      const updatedBusFee = state.school.payload.busFee.filter(
        (bus) => bus._id !== action.payload
      );
      state.school.payload.busFee = updatedBusFee;
    },

    DELETE_REVIEW: (state, action) => {
      const updatedReviews = state.school.payload.reviews.filter(
        (rev) => rev._id !== action.payload
      );
      state.school.payload.reviews = updatedReviews;
    },

    DELETE_FAQ: (state, action) => {
      const updatedFaqs = state.school.payload.faq.filter(
        (faq) => faq._id !== action.payload
      );
      state.school.payload.faq = updatedFaqs;
    },
    
    ADD_SCHOOL_BUS: (state, action) => {
      state.school.payload.busFee.push({
        location: action.payload.location,
        amounts: [
          {
            // date: getDate().fullDate,
            amount: action.payload.amount,
          },
        ],
      });
    },

    ADD_FAQ: (state, action) => {
      state.school.payload.faq.push(action.payload);
    },

    EDIT_FAQ: (state, action) => {
      const updatedFaqs = state.school.payload.faq.filter(
        (faq) => faq._id !== action.payload._id
      );
      state.school.payload.faq = updatedFaqs;

      state.school.payload.faq.push(action.payload);
    },

    SET_OTHERS_TAB: (state, action) => {
      state.school.payload.others = action.payload;
    },

    DELETE_OTHERS_TAB: (state, action) => {
      const updatedOthers = state.school.payload.others.filter(
        (tab) => tab._id !== action.payload
      );
      state.school.payload.others = updatedOthers;
    },

    ERROR_REMOVE: (state) => {
      state.error.payload = null;
    },

    GET_ACCOUNTS: (state, action) => {
      state.accounts = action.payload;
    },
  },
});

export const {
  GET_SCHOOL,
  GET_SCHOOL_FAIL,
  GET_SCHOOL_SUCCESS,
  ERROR_REMOVE,
  ADD_SCHOOL_BUS,
  DELETE_SCHOOL_BUS,
  DELETE_REVIEW,
  DELETE_FAQ,
  ADD_FAQ,
  EDIT_FAQ,
  DELETE_OTHERS_TAB,
  SET_OTHERS_TAB,
  AFTER_ADMISSION_WORK,
  SET_SCHOOL_ADMISSIONS,
  GET_ACCOUNTS
} = homeSlice.actions;

export default homeSlice.reducer;
