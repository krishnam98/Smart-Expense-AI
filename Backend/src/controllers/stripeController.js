import express from "express";
import Stripe from "stripe";
import { Expense } from "../models/Expense.js";
import { categorizeExpense } from "../services.js/gemini.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createCheckoutSession = async (req, res) => {
  try {
    const { title, amount, notes, date, userId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: title,
            },
            unit_amount: amount * 100, // ₹ → paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        userId,
        title,
        amount,
        paymentMethod: "stripe",
        notes,
        date,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create session" });
  }
};

export const stripeWebhook = [
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const meta = session.metadata;

        const { category } = await categorizeExpense({
          title: meta.title,
          amount: meta.amount,
          paymentMethod: "stripe",
          notes: meta.notes || "",
        });

        // Save to DB only after success
        await Expense.create({
          user: meta.userId,
          title: meta.title,
          amount: Number(meta.amount),
          date: new Date(meta.date),
          paymentMethod: "stripe",
          notes: meta.notes || "",
          category,
        });
      }

      res.status(200).send("OK");
    } catch (err) {
      console.error("Webhook Error:", err.message);
      res.sendStatus(400);
    }
  },
];
