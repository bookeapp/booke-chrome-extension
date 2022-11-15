import { VIEWS, XERO_HEADER_HEIGHT } from "const/Constants";
import {
  businessesSlice,
  statsSlice,
  textsSlice,
  uiSlice,
  userSlice
} from "slices";
import { configureStore } from "@reduxjs/toolkit";
import { getStoreData, setStoreData } from "utils";
import defaultTexts from "assets/texts/en.json";

const localStorageMiddleware = (store) => (next) => (action) => {
  const { type, payload } = action;

  if (typeof action === "function") {
    return action(store.dispatch, store.getState);
  }

  if (type === uiSlice.actions.setCurrentView.type) {
    setStoreData({ currentView: payload });
  }

  if (type === uiSlice.actions.setPositionY.type) {
    setStoreData({ positionY: payload });
  }

  return next(action);
};

const storedData = getStoreData();

export default configureStore({
  middleware: [localStorageMiddleware],
  reducer: {
    ui: uiSlice.reducer,
    texts: textsSlice.reducer,
    user: userSlice.reducer,
    stats: statsSlice.reducer,
    businesses: businessesSlice.reducer
  },
  preloadedState: {
    ui: {
      preloaderShown: true,
      currentView: storedData.currentView || VIEWS.DASHBOARD,
      // eslint-disable-next-line no-magic-numbers
      positionY: storedData.positionY || (((window.innerHeight - XERO_HEADER_HEIGHT) / 2) + XERO_HEADER_HEIGHT)
    },
    texts: defaultTexts,
    businesses: {
      data: [{
        id: 1,
        name: "New business from Xero"
      }]
    }
  }
});

