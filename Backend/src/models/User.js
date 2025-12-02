import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    profilePhoto: { type: String, default: "" },
    password: { type: String, required: true },
    targetMonthlyBudget: { type: Number, default: 0 }, // optional manual override
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
