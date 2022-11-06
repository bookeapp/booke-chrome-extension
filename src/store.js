import defaultTexts from "assets/texts/en.json";
import { configureStore } from "@reduxjs/toolkit";
import { uiSlice, textsSlice } from "slices";

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
    texts: textsSlice.reducer,
  },
  preloadedState: {
    texts: defaultTexts
  },
});

export default store;

