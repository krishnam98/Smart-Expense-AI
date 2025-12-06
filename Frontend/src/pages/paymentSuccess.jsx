import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchExpensesData } from "../features/expenses/expensesSlice";

export default function PaymentSuccess() {
  const [isVisible, setIsVisible] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchExpensesData());
    console.log("Fetching expenses data...");
  }, [dispatch]);



  useEffect(() => {
    setIsVisible(true);

    // Generate confetti
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti */}
      {confetti.map((item) => (
        <div
          key={item.id}
          className="absolute w-2 h-2 bg-rose-400 rounded-full animate-fall"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            top: "-20px",
          }}
        />
      ))}

      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Main card */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
      >
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`relative transform transition-all duration-1000 ${isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
              }`}
          >
            <div className="absolute inset-0 bg-rose-400 rounded-full blur-xl opacity-40 animate-pulse" />
            <CheckCircle
              className="relative w-24 h-24 text-rose-500"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Success message */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-lg mb-6">Thank you for your purchase</p>
          <span className="text-sm text-rose-400 font-bold cursor-pointer hover:underline" onClick={() => { navigate("/") }}>Go Back To Dashboard</span>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-400 to-pink-400 rounded-bl-full opacity-10" />
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}
