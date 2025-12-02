import { Expense } from "../models/Expense.js";
import { categorizeExpense } from "../services.js/gemini.js";

export const createExpense = async (req, res) => {
  try {
    const { title, amount, date, paymentMethod, notes } = req.body;

    const { category, subCategory } = await categorizeExpense({
      title,
      amount,
      paymentMethod,
      notes,
    });

    const expense = await Expense.create({
      user: req.userId,
      title,
      amount,
      date: date ? new Date(date) : new Date(),
      paymentMethod,
      notes,
      category,
      subCategory,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getExpense = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { user: req.userId };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMonthlyStats = async (req, res) => {
  try {
    const { year } = req.query;
    const y = parseInt(year) || new Date().getFullYear();

    const stats = await Expense.aggregate([
      {
        $match: {
          user: req.userId,
          date: {
            $gte: new Date(y, 0, 1),
            $lte: new Date(y, 11, 31, 23, 59, 59),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDailyState = async (req, res) => {
  try {
    const now = new Date();

    // If user provides ?month= and ?year= use those, else fallback to current month
    const month = req.query.month
      ? Number(req.query.month) - 1
      : now.getMonth();
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();

    // Range for the given month
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59);

    const stats = await Expense.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    // Convert Mongo format → clean response format
    const formatted = stats.map((d) => ({
      day: d._id.day,
      total: d.total,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCategoryDistribution = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const stats = await Expense.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
