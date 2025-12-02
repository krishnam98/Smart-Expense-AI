import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function categorizeExpense({
  title,
  amount,
  paymentMethod,
  notes,
}) {
  const prompt = `
You are an expense categorization assistant.

Your task: Assign the expense to exactly ONE category from the list.

Allowed Categories:
["Food & Dining","Groceries","Shopping","Clothing","Health & Fitness","Personal Care",
"Entertainment","Travel","Gifts & Donations","Education","Books & Courses",
"Subscriptions & Streaming","Rent","Electricity","Water","Gas","Internet",
"Mobile Recharge","Home Maintenance","Vehicle Fuel","Vehicle Maintenance",
"Insurance","Loan EMI","Savings","Investments","Taxes","Bank Charges",
"Pets","Kids","Miscellaneous"]

Expense Details:
Title: "${title}"
Amount: ${amount}
Payment Method: "${paymentMethod}"
Notes: "${notes || ""}"

Rules:
- Choose exactly ONE category from the allowed list.
- If unsure, return "Miscellaneous".
- Output ONLY valid JSON.
- Do NOT include explanations, comments.

Response format (strict):

{"category":"<one category from list>"}

`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });
  console.log(response);

  const raw = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  console.log("Gemini Output:", raw); // helpful debug

  try {
    const parsed = JSON.parse(raw);
    return {
      category: parsed.category || "Miscellaneous",
    };
  } catch (err) {
    console.error("❌ Gemini JSON parse failed:", raw);
    return { category: "Miscellaneous" };
  }
}

export async function suggestMonthlyBudget(expenses) {
  if (!expenses.length) {
    return {
      suggestedBudget: 0,
      message:
        "No expense history yet. Start tracking to get a suggested budget.",
    };
  }

  const last6MonthsText = expenses
    .map(
      (e) =>
        `${e.date.toISOString().slice(0, 10)} - ${e.title} - ${e.amount} - ${
          e.category
        }`
    )
    .join("\n");

  const prompt = `
You're a personal finance assistant.

Here is the user's expense history (last months):
${last6MonthsText}

1. Estimate a reasonable monthly budget amount (number only, in INR).
2. Provide a short human-friendly explanation.
3. Suggest percentage breakdown by category.

Return JSON only with:
{
  "suggestedBudget": number,
  "explanation": string,
  "byCategory": [{ "category": string, "percentage": number }]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text();
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch (err) {
    console.error("Failed to parse Gemini budget response", text);
    const monthlyAvg =
      expenses.reduce((sum, e) => sum + e.amount, 0) / (expenses.length || 1);
    return {
      suggestedBudget: Math.round(monthlyAvg),
      explanation: "Fallback to average of your past expenses.",
      byCategory: [],
    };
  }
}
