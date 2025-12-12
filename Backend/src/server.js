import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import expenseRouter from "./routes/expenseRoute.js";
import budgetRouter from "./routes/budgetRoute.js";
import payementRouter from "./routes/stripeRoute.js";

const app = express();

app.use(cors());

app.use("/api/stripe", payementRouter);
app.use(express.json());

app.use("/auth", authRouter);
app.use("/expense", expenseRouter);
app.use("/budget", budgetRouter);
app.use("/payment", payementRouter);

app.head("/ping", (_, res) => res.sendStatus(200));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
