import express from "express";
import {
  checkUsername,
  login,
  register,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/checkUsername", checkUsername);

export default authRouter;
