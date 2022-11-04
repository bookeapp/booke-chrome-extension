// Import reducers
import uiSlice from "slices/ui";

import { configureStore } from "@reduxjs/toolkit";

let store = null;

export const getStore = () => {
  return store;
};

export const getState = () => {
  if (!store) return null;

  return store.getState();
};

store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  }
});

export default store;

