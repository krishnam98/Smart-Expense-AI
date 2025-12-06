import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Layers, Calendar, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalyticalData } from "../features/analytics/analyticslice";

export default function ExpenseAnalytics() {
    const { loading, analyticsData, error } = useSelector(state => state.analytics);
    const [activeTab, setActiveTab] = useState("expenses");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAnalyticalData());
    }, []);

    const COLORS = [
        "#fb7185",
        "#f472b6",
        "#fb923c",
        "#fbbf24",
        "#f97316",
        "#ec4899",
    ];

    const chartColors = {
        primary: "#e11d48",
    };

    const monthlyTotals = analyticsData?.map((month) => ({
        month: month.month,
        total: month.daily.reduce((sum, day) => sum + day.amount, 0),
    }));

    const getMonthName = (monthKey) => {
        const [year, month] = monthKey.split("-");
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-rose-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-rose-50">
            <div className="bg-white border-b border-pink-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-rose-600" />
                            </button>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics</h1>
                                <p className="text-xs sm:text-sm text-gray-500">Last 6 months insights</p>
                            </div>
                        </div>
                        <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-rose-600" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="bg-white rounded-2xl p-2 shadow-sm border border-pink-100 inline-flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab("expenses")}
                        className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl font-medium transition-all text-xs sm:text-base ${activeTab === "expenses"
                            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
                            : "text-gray-600 hover:bg-pink-50"
                            }`}
                    >
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Monthly
                    </button>
                    <button
                        onClick={() => setActiveTab("categories")}
                        className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl font-medium transition-all text-xs sm:text-base ${activeTab === "categories"
                            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
                            : "text-gray-600 hover:bg-pink-50"
                            }`}
                    >
                        <Layers className="w-4 h-4 inline mr-2" />
                        Categories
                    </button>
                </div>

                {activeTab === "expenses" && (
                    <>
                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-pink-100">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">6-Month Overview</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyTotals}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
                                    <XAxis dataKey="month" tick={{ fill: "#9f1239", fontSize: 11 }} />
                                    <YAxis tick={{ fill: "#9f1239", fontSize: 11 }} />

                                    <Bar dataKey="total" fill={chartColors.primary} radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {analyticsData.map((monthData, index) => {
                                const dailyData = monthData.daily.map((d) => ({
                                    day: `${d.day}`,
                                    amount: d.amount,
                                }));

                                return (
                                    <div
                                        key={monthData.month}
                                        className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 hover:shadow-md transition-shadow"
                                    >
                                        <h3 className="text-sm font-bold text-gray-900 mb-3">
                                            {getMonthName(monthData.month)}
                                        </h3>
                                        <ResponsiveContainer width="100%" height={180}>
                                            <LineChart data={dailyData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
                                                <XAxis
                                                    dataKey="day"
                                                    tick={{ fontSize: 9, fill: "#9f1239" }}
                                                    interval="preserveStartEnd"
                                                />
                                                <YAxis tick={{ fontSize: 9, fill: "#9f1239" }} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "#fff",
                                                        border: "1px solid #fecdd3",
                                                        borderRadius: "8px",
                                                        fontSize: "11px",
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="amount"
                                                    stroke={COLORS[index % COLORS.length]}
                                                    strokeWidth={2}
                                                    dot={{ fill: COLORS[index % COLORS.length], r: 2 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                        <div className="mt-3 text-center">
                                            <p className="text-xs text-gray-500">Total</p>
                                            <p className="text-lg font-bold text-rose-600">
                                                ₹{dailyData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {activeTab === "categories" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {analyticsData.map((monthData) => {
                            const categoryData = monthData.categories.map((cat) => ({
                                name: cat.category,
                                value: cat.total,
                            }));

                            const totalSpent = categoryData.reduce((sum, c) => sum + c.value, 0);

                            return (
                                <div
                                    key={monthData.month}
                                    className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 hover:shadow-md transition-shadow"
                                >
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                                        {getMonthName(monthData.month)}
                                    </h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) =>
                                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                                }
                                                style={{ fontSize: "8px" }}
                                                outerRadius={60}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {categoryData.map((entry, i) => (
                                                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #fecdd3",
                                                    borderRadius: "8px",
                                                    fontSize: "4px",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-4 space-y-2">
                                        {categoryData.map((cat, i) => (
                                            <div key={i} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <div
                                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                                    ></div>
                                                    <span className="text-gray-700 truncate">{cat.name}</span>
                                                </div>
                                                <span className="font-semibold text-gray-900 ml-2 flex-shrink-0">
                                                    ₹{cat.value.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="pt-2 border-t border-pink-100 flex justify-between font-bold text-sm">
                                            <span className="text-gray-700">Total</span>
                                            <span className="text-rose-600">₹{totalSpent.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {analyticsData.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-sm border border-pink-100">
                        <Layers className="w-12 sm:w-16 h-12 sm:h-16 text-pink-300 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Data Yet</h3>
                        <p className="text-sm text-gray-500">
                            Start tracking your expenses to see beautiful analytics here!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}