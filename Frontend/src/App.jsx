import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ExpenseAnalytics from "./pages/ExpenseAnalytics.jsx";
import PaymentSuccess from "./pages/paymentSuccess.jsx";
import PaymentCancelled from "./pages/paymentCancelled.jsx";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/analytics"
        element={
          <ProtectedRoute>
            <ExpenseAnalytics />
          </ProtectedRoute>
        } />

      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancel" element={<PaymentCancelled />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
