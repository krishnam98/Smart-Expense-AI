import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  createCheckoutSession,
  stripeWebhook,
} from "../controllers/stripeController.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create-checkout-session",
  authMiddleware,
  createCheckoutSession
);

paymentRouter.post("/webhook", stripeWebhook);

export default paymentRouter;
