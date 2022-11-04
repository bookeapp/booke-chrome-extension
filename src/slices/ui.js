import { createSlice } from "@reduxjs/toolkit";
import { VIEWS } from "const/Constants";

export const getPreloaderState = ({ ui : { preloaderShown }}) => preloaderShown;

export const getCurrentView = ({ ui : { currentView }}) => currentView;

export default createSlice({
  name: "ui",
  initialState: {
    preloaderShown: true,
    currentView: VIEWS.DASHBOARD
  },
  reducers: {
    togglePreloader: (state, { payload }) => ({ ...state, preloaderShown: payload }),
    setCurrentView: (state, { payload }) => ({ ...state, currentView: payload }),
  }
})