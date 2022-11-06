import { createSlice } from "@reduxjs/toolkit";
import { VIEWS } from "const/Constants";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    preloaderShown: true,
    currentView: VIEWS.DASHBOARD
  },
  reducers: {
    togglePreloader: (state, { payload }) => ({ ...state, preloaderShown: payload }),
    setCurrentView: (state, { payload }) => ({ ...state, currentView: payload }),
  }
});

export const textsSlice = createSlice({
  name: "texts",
  initialState: {},
  reducers: {
    setTexts: (state, { payload }) => payload,
  }
});