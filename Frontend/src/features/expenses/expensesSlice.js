import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient.js";

const initialState = {
  currentMonthTotal: 0,
  totalTransactions: 0,
  loading: false,
  error: null,
};

export const fetchExpensesData = createAsyncThunk(
  "expenses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const cmTotal = await axiosClient.get("/expense/currentMonth/total");

      return {
        currentMonthTotal: cmTotal.data.totalAmount,
        totalTransactions: cmTotal.data.transactionCount,
      };
    } catch (err) {
      return rejectWithValue("Failed to load expenses");
    }
  }
);

export const addExpense = createAsyncThunk(
  "expenses/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/expense/create", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to add expense");
    }
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpensesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpensesData.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.currentMonthTotal = action.payload.currentMonthTotal;
        state.totalTransactions = action.payload.totalTransactions;
      })
      .addCase(fetchExpensesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default expensesSlice.reducer;
