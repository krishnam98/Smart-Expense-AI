import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { addExpense } from "./expensesSlice";

const initialState = {
  list: [],
  totalPages: 0,
  currentPage: 0,
  totalCount: 0,
  loading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  "expenses/fetch",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      const res = await axiosClient.get("/expense/get?page=" + data.page);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to load expenses");
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    updateCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.expenses;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export const { updateCurrentPage } = transactionSlice.actions;
export default transactionSlice.reducer;
