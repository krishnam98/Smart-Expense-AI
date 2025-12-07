# Smart Expense AI — Modern Personal Finance Tracker

> A full-stack intelligent finance tracking system designed to understand spending habits, automate categorization, visualize cash flow trends, and enable seamless payments — built using MERN Stack, Stripe, and Google Gemini AI.

<!-- Demo Video Here -->

## 📸 Screenshots

| Page                                        | Preview                                                              |
| ------------------------------------------- | -------------------------------------------------------------------- |
| **Dashboard**                               | ![Dashboard](/Screenshots/DashBoard.jpeg)                            |
| **Transactions With AI Categorization**     | ![Transaction Table](/Screenshots/Recent%20Transaction.png)          |
| **Monthly Analytics (6 Month Graphs)**      | ![Monthly Analytics](/Screenshots/Monthly%20Analytics.png)           |
| **Category Wise Analysis (6 Month Graphs)** | ![Category Wise Analysis](/Screenshots/Analytics.png)                |
| **Stripe Checkout**                         | ![Stripe Checkout](/Screenshots/StripeCheckout.jpeg)                 |
| **Payment successfull**                     | ![Payment Successfull Page](/Screenshots/Payment%20Successfull.jpeg) |

## Why I Built This

Managing money manually becomes painful — tracking random UPI receipts, categorizing purchases, finding spending patterns, or understanding where money is really going.

So this project solves that through:

- Automation

- Design

- Accuracy

- Ownership of personal finance insights

## ✨ Features

### 🔐 Authentication & User Identity

- JWT-based secure authentication

- Username availability check with live validation

- Profile photo support

- Protected Routes using React + Redux Toolkit

### 💵 Expense Management

- Add expenses (title, note, date, payment method, amount)

- AI-powered auto categorization (Gemini)

- Manual and automated payment-based tracking

- Pagination & filtering (Month, Year)

### 🤖 AI Categorization using Gemini

- Every expense is passed to Gemini with a predefined domain dictionary:

- Ensures structured categorization

- Prevents inconsistent categories

- Uses fallback mode (Miscellaneous) when prediction confidence is low

Example AI output:

```json
{ "category": "Groceries" }
```

### 📈 Deep Analytics Dashboard

A visual dashboard showing:

| Metric                                      | Description       |
| ------------------------------------------- | ----------------- |
| **Monthly Spending Graphs (Last 6 months)** | Bar + Line trends |
| **Category Distribution Pie-Charts**        | Where money goes  |

All visualized using **Recharts** .

## 💳 Payments (Stripe Integration)

- Users can pay directly inside the app

- Successful payments automatically become expenses only after Stripe confirms via webhook

- Supports: Card, UPI, Wallet, Apple Pay (where supported)

- Transaction count & receipts stored for audit

## 🧾 AI Budget Suggestion

- Analyzes last months

- Suggests budget & category caps

## 🧰 Tech Stack

| Layer    | Technology                                                       |
| -------- | ---------------------------------------------------------------- | -------------------------------------------------------------- | --- |
| Frontend | React (Vite), TailwindCSS, Redux Toolkit, Lucide Icons, Recharts |
| Backend  | Node.js, Express.js                                              |
| Database | MongoDB + Mongoose                                               |
| AI       | Google Gemini API                                                |
| Payments | Stripe Checkout + Webhooks                                       |
| Auth     | JWT, bcrypt, protected routes                                    |
| <!--     | Deployment                                                       | _(adjust based on where you deploy)_ Vercel / Render / Railway | --> |

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/krishnam98/Smart-Expense-AI
cd smart-expense-ai
```

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
```

### `.env` Required:

```ini
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=
CLIENT_URL=http://localhost:5173
```

Run Server

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

## 🧪 API & Postman Testing

| Method | Endpoint                           | Description                                                                            |
| ------ | ---------------------------------- | -------------------------------------------------------------------------------------- |
| `POST` | `/auth/register`                   | Create user                                                                            |
| `POST` | `/auth/login`                      | Log in                                                                                 |
| `GET`  | `/auth/checkUsername?username=key` | Check username availability                                                            |
| `POST` | `expense/create`                   | add an expense                                                                         |
| `POST` | `/payment/create-checkout-session` | Create Stripe checkout                                                                 |
| `POST` | `/api/stripe/webhook`              | Stripe event verification                                                              |
| `GET`  | `expense/get?page=1`               | Paginated expense fetching                                                             |
| `GET`  | `/expense/analytical`              | Charts & insights                                                                      |
| `GET ` | `/expense/currentMonth/total`      | get current month total & total transaction count this month                           |
| `GET`  | `/budget/suggest`                  | get Suggested Budget & Insights Based on Previous 6 Months Data using Google Gemini AI |

## ⚠️ Important Webhook Note (Development)

- Stripe DOES NOT save the payment in the database without a webhook event.

### 🔥 Webhook MUST be running while testing payments locally.

> Otherwise, although Stripe will redirect you to the success page, the expense will not be recorded in the database.

### Why?

> Stripe only confirms the transaction via webhook — not the frontend redirect.
> So the webhook listener must be active to save the transaction.

- Make sure you installed Stripe CLI into your Machine

Run:

```bash
stripe login
stripe listen --forward-to http://localhost:5000/api/stripe/webhook
```

Copy displayed key to `.env`:

```ini
STRIPE_WEBHOOK_SECRET=whsec_....
```

### 💡 Symptoms When Webhook Is OFF

| Behavior                        | Meaning                                  |
| ------------------------------- | ---------------------------------------- |
| Stripe Checkout completes       | User paid                                |
| Expense **NOT saved**           | Webhook was not active or not configured |
| Success page shows but DB empty | Normal — webhook required to finalize    |

### 📦 Production Notes

- Webhook must be configured manually inside Stripe Dashboard

- Use HTTPS endpoint, not localhost

- Make sure raw body parser is used before express.json()

## 🏆 What This Project Demonstrates

- Full-stack system design
- Real payment integration
- Responsible data handling
- Asynchronous event-driven processing (webhooks)
- AI-assisted UX
- Graph analytics with business value
- Enterprise-style error handling & architecture

# 👨‍💻 Author

**Krishnam Soni**

📧 Email: **sonikrishnam98@gmail.com**

🔗 Connect with me on [**LinkedIn**](https://www.linkedin.com/in/krishnamsoni9981/)

🌐 Portfolio [**Visit Website**](https://krishnam-s-portfolio.onrender.com/)

---

> ⭐ If you found this project interesting or helpful, consider giving it a star — it helps visibility and motivates future improvements!
