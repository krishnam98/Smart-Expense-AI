import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice.js";
import expensesReducer from "./features/expenses/expensesSlice.js";
import analyticslice from "./features/analytics/analyticslice.js";
import transactionSliceReducer from "./features/expenses/transactionSlice.js";
import aisliceReducer from "./features/ai/aislice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    analytics: analyticslice.reducer,
    transactions: transactionSliceReducer,
    ai: aisliceReducer,
  },
});
