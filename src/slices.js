import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "api/Api";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {},
  reducers: {
    togglePreloader: (state, { payload }) => ({ ...state, preloaderShown: payload }),
    setCurrentView: (state, { payload }) => ({ ...state, currentView: payload }),
    setPositionY: (state, { payload }) => ({ ...state, positionY: payload }),
    setCurrentShortCode: (state, { payload }) => ({ ...state, shortCode: payload })
  }
});

export const textsSlice = createSlice({
  name: "texts",
  initialState: {},
  reducers: {
    setTexts: (state, { payload }) => payload
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState: { data: null },
  reducers: {
    setUserData: (state, { payload }) => ({ ...state, data: payload })
  }
});

export const fetchStats = createAsyncThunk("stats/fetch", async(shortCode) => {
  const response = await api.fetchStats(shortCode);

  return response.results;
});

export const statsSlice = createSlice({
  name: "stats",
  initialState: {
    statsFetching: false,
    data: null
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchStats.pending, (state) => ({ ...state, statsFetching: true }))
      .addCase(fetchStats.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload,
          statsFetching: false
        };
      })
      .addCase(fetchStats.rejected, (state, action) => ({ ...state, statsFetching: false, error: action.error.message }));
  }
});
