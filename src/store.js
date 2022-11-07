import defaultTexts from "assets/texts/en.json";
import { configureStore } from "@reduxjs/toolkit";
import { uiSlice, textsSlice, businessesSlice } from "slices";

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
    businesses: businessesSlice.reducer,
  },
  preloadedState: {
    texts: defaultTexts,
    businesses: {
      data: [{
        id: 1,
        name: "New business from Xero"
      }]
    }
  },
});

export default store;

