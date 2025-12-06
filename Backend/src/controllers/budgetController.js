import { Expense } from "../models/Expense.js";
import { suggestMonthlyBudget } from "../services.js/gemini.js";

export const suggestbudget = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const expenses = await Expense.find({
      user: req.userId,
      date: { $gte: sixMonthsAgo },
    }).sort({ date: 1 });

    const suggestion = await suggestMonthlyBudget(expenses);
    res.json(suggestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
