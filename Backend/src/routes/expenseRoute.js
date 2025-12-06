import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  createExpense,
  getCategoryDistribution,
  getCurrentMonthTotal,
  getDailyState,
  getExpense,
  getLastSixMonthStats,
  getMonthlyStats,
} from "../controllers/expenseController.js";

const expenseRouter = express.Router();

expenseRouter.post("/create", authMiddleware, createExpense);
expenseRouter.get("/get", authMiddleware, getExpense);
expenseRouter.get("/stats/monthly", authMiddleware, getMonthlyStats);
expenseRouter.get("/stats/category", authMiddleware, getCategoryDistribution);
expenseRouter.get("/stats/daily", authMiddleware, getDailyState);
expenseRouter.get("/analytical", authMiddleware, getLastSixMonthStats);
expenseRouter.get("/currentMonth/total", authMiddleware, getCurrentMonthTotal);

export default expenseRouter;
