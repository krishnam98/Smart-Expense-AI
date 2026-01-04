import mongoose from "mongoose";
import { Expense } from "../models/Expense.js";
import { categorizeExpense } from "../services.js/gemini.js";

export const createExpense = async (req, res) => {
  try {
    const { title, amount, date, paymentMethod, notes } = req.body;

    const { category } = await categorizeExpense({
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
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getExpense = async (req, res) => {
  try {
    const { month, year, page = 1 } = req.query;
    const limit = 20; // 20 items per page
    const skip = (page - 1) * limit;

    const query = { user: req.userId };

    // Apply month + year filters if provided
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    // Count total matching records (for pagination UI)
    const totalCount = await Expense.countDocuments(query);

    // Fetch paginated results
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      pageSize: limit,
      expenses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMonthlyStats = async (req, res) => {
  try {
    const { year } = req.query;
    const y = parseInt(year) || new Date().getFullYear();
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const stats = await Expense.aggregate([
      {
        $match: {
          user: userObjectId,
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

export const getCurrentMonthTotal = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const today = new Date();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const result = await Expense.aggregate([
      {
        $match: {
          user: userObjectId,
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }, // total money spent
          transactionCount: { $sum: 1 }, // total number of records
        },
      },
    ]);

    return res.json({
      month: today.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      totalAmount: result.length > 0 ? result[0].totalAmount : 0,
      transactionCount: result.length > 0 ? result[0].transactionCount : 0,
    });
  } catch (err) {
    console.error("Error fetching current month total:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getLastSixMonthStats = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const raw = await Expense.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: sixMonthsAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
            category: "$category",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    const result = {};

    raw.forEach((r) => {
      const monthKey = `${r._id.year}-${String(r._id.month).padStart(2, "0")}`;

      if (!result[monthKey]) {
        result[monthKey] = {
          month: monthKey,
          daily: [],
          categories: {},
        };
      }

      // Daily Spending Entry
      result[monthKey].daily.push({
        day: r._id.day,
        amount: r.total,
      });

      // Category Spending
      result[monthKey].categories[r._id.category] =
        (result[monthKey].categories[r._id.category] || 0) + r.total;
    });

    // Convert category object into array format
    const formatted = Object.values(result).map((m) => ({
      month: m.month,
      daily: m.daily,
      categories: Object.entries(m.categories).map(([category, total]) => ({
        category,
        total,
      })),
    }));

    res.json(formatted);
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
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const stats = await Expense.aggregate([
      {
        $match: {
          user: userObjectId,
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
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const stats = await Expense.aggregate([
      {
        $match: {
          user: userObjectId,
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
