import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { suggestbudget } from "../controllers/budgetController.js";

const budgetRouter = express.Router();

budgetRouter.get("/suggest", authMiddleware, suggestbudget);

export default budgetRouter;
