import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

const initialState = {
  budget: null,
  Loading: false,
  error: null,
};

export const fetchAIData = createAsyncThunk(
  "expenses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const budgetRes = await axiosClient.get("/budget/suggest");
      return {
        budget: budgetRes.data,
      };
    } catch (err) {
      return rejectWithValue("Failed to load expenses");
    }
  }
);

const aislice = createSlice({
  name: "ai",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIData.fulfilled, (state, action) => {
        state.loading = false;
        state.budget = action.payload.budget;
      })
      .addCase(fetchAIData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default aislice.reducer;
