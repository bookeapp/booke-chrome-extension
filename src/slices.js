import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { VIEWS } from "const/Constants";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    preloaderShown: false,
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

export const businessesSlice = createSlice({
  name: "businesses",
  initialState: {
    businessesFetching: false,
    data: [],
  },
  reducers: {}
});

/* export const fetchPosts = createAsyncThunk("businesses/fetch", async () => {
  const response = await client.get("/api/businesses")
  return response.data;
}) */