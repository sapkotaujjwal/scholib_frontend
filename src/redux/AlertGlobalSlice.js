import { createSlice, nanoid } from "@reduxjs/toolkit";

export const alertGlobalSlice = createSlice({
  name: "AlertGlobal",
  initialState: {
    alerts: [], // Store multiple alerts
  },
  reducers: {
    SET_ALERT_GLOBAL: (state, action) => {
      const newAlert = {
        id: nanoid(), // Generate a unique ID
        ...action.payload, // Merge with provided alert data
      };
      state.alerts.push(newAlert);
    },
    REMOVE_ALERT_GLOBAL: (state, action) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload); // Remove a specific alert
    },
  },
});

export const { SET_ALERT_GLOBAL, REMOVE_ALERT_GLOBAL } = alertGlobalSlice.actions;
export default alertGlobalSlice.reducer;
