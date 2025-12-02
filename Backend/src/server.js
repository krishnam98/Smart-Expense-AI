import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
