import {
  businessesSlice,
  statsSlice,
  textsSlice,
  uiSlice,
  userSlice
} from "slices";
import { configureStore } from "@reduxjs/toolkit";
import defaultTexts from "assets/texts/en.json";

export default configureStore({
  reducer: {
    ui: uiSlice.reducer,
    texts: textsSlice.reducer,
    user: userSlice.reducer,
    stats: statsSlice.reducer,
    businesses: businessesSlice.reducer
  },
  preloadedState: {
    texts: defaultTexts,
    businesses: {
      data: [{
        id: 1,
        name: "New business from Xero"
      }]
    }
  }
});

