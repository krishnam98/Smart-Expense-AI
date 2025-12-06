import { useState } from "react";
import { useDispatch } from "react-redux";
import { addExpense, fetchExpensesData } from "../features/expenses/expensesSlice.js";
import { Banknote, PlusCircle } from "lucide-react";

export default function ExpenseForm() {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        title: "",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        paymentMethod: "upi",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [stripeLoading, setStripeLoading] = useState(false);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.amount) return;

        setLoading(true);
        try {
            await dispatch(
                addExpense({
                    ...form,
                    amount: Number(form.amount),
                })
            ).unwrap();
            setForm((f) => ({ ...f, title: "", amount: "", notes: "" }));
            dispatch(fetchExpensesData());
        } catch {
            alert("Failed to add expense");
        } finally {
            setLoading(false);
        }
    };

    const handleStripePayment = async (e) => {
        e.preventDefault();
        if (!form.title || !form.amount) return;
        console.log(form.title, form.amount);

        try {
            const res = await fetch("http://localhost:5000/payment/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify({
                    ...form,
                    userId: JSON.parse(localStorage.getItem("user")).id,
                }),
            });

            const { url } = await res.json();
            window.location.href = url; // redirect to stripe
            // console.log(url);
        } catch (err) {
            alert("Payment failed to start");
        }
    };




    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Expense</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-2">Item</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                        placeholder="e.g., Lunch at cafe"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Amount (₹)</label>
                    <input
                        name="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.amount}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                        placeholder="0"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-2">Payment Method</label>
                    <select
                        name="paymentMethod"
                        value={form.paymentMethod}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                    >
                        <option value="upi">UPI</option>
                        <option value="card">Card</option>
                        <option value="cash">Cash</option>
                        <option value="netbanking">Net Banking</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-2">Notes (Optional)</label>
                    <textarea
                        name="notes"
                        rows={2}
                        value={form.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all resize-none"
                        placeholder="Add any additional details..."
                    />
                </div>
            </div>
            <div className="w-full flex justify-between">

                <button
                    onClick={handleSubmit}
                    className=" flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                    <PlusCircle className="w-5 h-5" />
                    Add Expense
                </button>
                <button
                    disabled={stripeLoading}
                    onClick={handleStripePayment}
                    className=" flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-lg transition-all"
                >
                    <Banknote className="w-5 h-5" />
                    Pay
                </button>
            </div>

        </div>
    );
}
