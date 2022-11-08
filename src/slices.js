import { VIEWS } from "const/Constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import restApi from "api/RestApi";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    preloaderShown: true,
    currentView: VIEWS.MAIN
  },
  reducers: {
    togglePreloader: (state, { payload }) => ({ ...state, preloaderShown: payload }),
    setCurrentView: (state, { payload }) => ({ ...state, currentView: payload })
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

export const businessesSlice = createSlice({
  name: "businesses",
  initialState: {
    businessesFetching: false,
    data: []
  },
  reducers: {}
});

export const fetchStats = createAsyncThunk("stats/fetch", async(shortCode) => {
  const response = await restApi.get(`${shortCode}/stats`);

  return response.results;
});

export const statsSlice = createSlice({
  name: "stats",
  initialState: {
    statsFetching: false,
    data: []
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
