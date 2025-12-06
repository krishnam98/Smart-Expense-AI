import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Username already taken" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      password: passwordHash,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);

    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid credentials, Check Username" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ message: "Invalid credentials, Check Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        available: false,
        message: "Username must be at least 3 characters.",
      });
    }

    const exists = await User.findOne({ username: username.toLowerCase() });

    if (exists) {
      return res.json({ available: false, message: "Username already taken." });
    }

    return res.json({ available: true, message: "Username is available!" });
  } catch (error) {
    console.error("Username check error:", error);
    res.status(500).json({ available: false, message: "Server error" });
  }
};
