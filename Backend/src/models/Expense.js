import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true }, // item name
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "netbanking", "other", "stripe"],
      default: "other",
    },
    category: { type: String }, // from Gemini
    subCategory: { type: String }, // from Gemini
    notes: { type: String },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
