import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchAnalyticalData = createAsyncThunk(
  "expenses/fetchAnalyticalData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/expense/analytical");
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Failed to add expense");
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  analyticsData: [],
};

const analyticslice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticalData.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload;
      })
      .addCase(fetchAnalyticalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default analyticslice;
