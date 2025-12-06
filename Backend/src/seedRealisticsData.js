import mongoose from "mongoose";
import "dotenv/config";
import { Expense } from "../src/models/Expense.js";

// !!! IMPORTANT: Replace with your actual Mongo User _id (user from register/login)
const USER_ID = "692ed1121475c7b3fd79afcf";

// ------------------ DATA POOLS ------------------

const merchants = {
  "Food & Dining": [
    "Swiggy - Domino’s",
    "Zomato - Biryani By Kilo",
    "KFC",
    "McDonald's",
    "Burger King",
    "Haldiram's",
    "Street Food Chai & Samosa",
    "CCD (Cafe Coffee Day)",
  ],

  Groceries: [
    "Blinkit",
    "BigBasket",
    "DMart",
    "Reliance Smart Bazaar",
    "Local Kirana Shop",
  ],

  Travel: [
    "Uber Auto",
    "Rapido Bike",
    "Ola Ride",
    "Metro Recharge",
    "IRCTC Train Ticket",
  ],

  "Vehicle Fuel": [
    "Indian Oil Petrol Pump",
    "HP Petrol Pump",
    "Bharat Petroleum",
  ],

  "Subscriptions & Streaming": [
    "Netflix",
    "Amazon Prime",
    "Hotstar",
    "Spotify",
    "YouTube Premium",
  ],

  Electricity: ["MPEB Light Bill", "Torrent Power", "Adani Electricity"],

  Internet: ["JioFiber", "Airtel Fiber", "ACT Broadband"],

  Shopping: ["Amazon Order", "Flipkart Order", "Myntra Clothing", "Nykaa"],

  "Personal Care": [
    "Parlour Grooming",
    "Dermaco Skin Products",
    "Pharmacy - Face Wash, Grooming Kit",
  ],

  Miscellaneous: [
    "Random Expense",
    "Misc Item Purchase",
    "Gift Item",
    "Stationery Store",
  ],
};

const paymentMethods = ["upi", "card", "cash", "netbanking", "other"];

// ------------------ GENERATION LOGIC ------------------

function random(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function generateExpense(date) {
  const categories = Object.keys(merchants);
  const category = random(categories);

  return {
    user: USER_ID,
    title: random(merchants[category]),
    category,
    amount: Math.floor(Math.random() * 1500) + 80, // ₹80–₹1580 realistic range
    paymentMethod: random(paymentMethods),
    notes: "",
    date,
  };
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB 🚀");

  const start = new Date("2025-01-01");
  const end = new Date("2025-12-04");

  let cursor = new Date(start);
  const records = [];

  while (cursor <= end) {
    // Generate 0–3 expenses per day (natural pattern)
    const count = Math.floor(Math.random() * 3);

    for (let i = 0; i < count; i++) {
      records.push(generateExpense(new Date(cursor)));
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  await Expense.insertMany(records);
  console.log(`Inserted ${records.length} realistic expense records 🎉`);
  process.exit();
}

seed();
