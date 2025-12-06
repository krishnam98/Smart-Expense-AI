import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseTable from "../components/ExpenseTable.jsx";
import StatsTabs from "../components/StatsTabs.jsx";
import { fetchExpensesData } from "../features/expenses/expensesSlice.js";
import { Menu, Sparkles, X } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";
import AIInsightCard from "../components/AIInsisghtCard.jsx";

export default function Dashboard() {
    const { currentMonthTotal, totalTransactions, loading } = useSelector((state) => state.expenses);
    const { budget } = useSelector((state) => state.ai);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchExpensesData());
        console.log("Fetching expenses data...");
    }, [dispatch]);



    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-rose-50">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-pink-100"
            >
                {sidebarOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5 text-rose-600" />}
            </button>

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <div className="flex-1 lg:ml-64">
                    <TopBar />

                    <main className="p-4 md:p-6 lg:p-8 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100 hover:shadow-md transition-shadow">
                                <p className="text-xs text-gray-500 mb-1 font-medium">Spent this month</p>
                                <p className="text-3xl font-bold text-rose-600">₹{currentMonthTotal.toLocaleString()}</p>
                            </div>

                            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5 shadow-sm border border-pink-200 hover:shadow-md transition-shadow">
                                <p className="text-xs text-gray-600 mb-1 font-medium">AI suggested budget</p>
                                <p className="text-2xl font-bold text-pink-700">₹{budget?.suggestedBudget ? `${budget.suggestedBudget.toLocaleString()}` : "--"}</p>
                            </div>

                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
                                <p className="text-xs text-gray-600 mb-1 font-medium">Transactions</p>
                                <p className="text-2xl font-bold text-amber-700">{totalTransactions}</p>
                            </div>


                        </div>

                        {/* Expense Form & AI Insight Side by Side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ExpenseForm />
                            <AIInsightCard insight={budget?.explanation ||
                                "Once you track a few weeks of expenses, Smart Expense AI will start suggesting a budget that feels right for you."} />
                        </div>

                        {/* Expense Table */}
                        <ExpenseTable />
                    </main>
                </div>
            </div>
        </div>
    );

}
