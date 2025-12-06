import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    AreaChart,
    Area,
} from "recharts";
import { CalendarDays, BarChart3, PieChart as PieIcon } from "lucide-react";

const CATEGORY_COLORS = [
    "#f97316", // amber-like orange
    "#22c55e", // emerald
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#eab308", // yellow
    "#a855f7", // purple
    "#f97373", // soft red
    "#34d399", // mint
];

export default function StatsTabs() {
    const [tab, setTab] = useState("monthly");
    const { categories, monthlyStats, dailyStats } = useSelector(
        (state) => state.expenses
    );
    console.log(categories, monthlyStats, dailyStats);

    const categoryData = useMemo(() => {
        if (!categories?.length) return [];
        return categories.map((c, idx) => ({
            name: c._id || "Misc",
            value: c.total,
            color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
        }));
    }, [categories]);

    const monthlyData = useMemo(() => {
        if (!monthlyStats?.length) return [];
        return monthlyStats.map((m) => ({
            month: ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct", "Nov", "Dec"][m._id.month],
            total: m.total,
        }));
    }, [monthlyStats]);

    const dailyData = useMemo(() => {
        if (!dailyStats?.length) return [];
        return dailyStats.map((d) => ({
            day: d.day,
            total: d.total,
        }));
    }, [dailyStats]);

    return (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 xs:p-4 space-y-3">
            {/* Tabs */}
            <div className="flex items-center justify-between gap-2">
                <div className="inline-flex rounded-full bg-slate-950/80 border border-slate-800/80 p-1">
                    <button
                        onClick={() => setTab("monthly")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition ${tab === "monthly"
                            ? "bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 text-slate-950 shadow"
                            : "text-slate-300"
                            }`}
                    >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Monthly Trend</span>
                    </button>
                    <button
                        onClick={() => setTab("daily")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition ${tab === "daily"
                            ? "bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 text-slate-950 shadow"
                            : "text-slate-300"
                            }`}
                    >
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>Daily Pattern</span>
                    </button>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <PieIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span>Category split this month</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
                {/* Left: Category Pie */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2 flex flex-col">
                    <p className="text-[11px] text-slate-400 mb-1">Categories</p>
                    {categoryData.length === 0 ? (
                        <p className="text-xs text-slate-500">
                            No data yet for this month.
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height={230}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={2}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name) => [
                                        `₹${value.toFixed(0)}`,
                                        name,
                                    ]}
                                    contentStyle={{
                                        backgroundColor: "#020617",
                                        borderRadius: "10px",
                                        border: "1px solid #1f2933",
                                        fontSize: "11px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Right: Graph - Monthly or Daily */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2 flex flex-col">
                    <p className="text-[11px] text-slate-400 mb-1">
                        {tab === "monthly" ? "Monthly total spend" : "Daily spend (current / selected month)"}
                    </p>
                    {tab === "monthly" ? (
                        monthlyData.length === 0 ? (
                            <p className="text-xs text-slate-500">No monthly data yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={230}>
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
                                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                                    <YAxis stroke="#9ca3af" fontSize={10} />
                                    <Tooltip
                                        formatter={(val) => `₹${val.toFixed(0)}`}
                                        contentStyle={{
                                            backgroundColor: "#020617",
                                            borderRadius: "10px",
                                            border: "1px solid #1f2933",
                                            fontSize: "11px",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                        dot={{ r: 3, stroke: "#22c55e", strokeWidth: 1, fill: "#0f172a" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )
                    ) : dailyData.length === 0 ? (
                        <p className="text-xs text-slate-500">No daily data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={230}>
                            <AreaChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
                                <XAxis
                                    dataKey="day"
                                    stroke="#9ca3af"
                                    fontSize={10}
                                    tickFormatter={(d) => `D${d}`}
                                />
                                <YAxis stroke="#9ca3af" fontSize={10} />
                                <Tooltip
                                    formatter={(val) => `₹${val.toFixed(0)}`}
                                    contentStyle={{
                                        backgroundColor: "#020617",
                                        borderRadius: "10px",
                                        border: "1px solid #1f2933",
                                        fontSize: "11px",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#22c55e"
                                    fill="url(#dailyGradient)"
                                    strokeWidth={1.8}
                                />
                                <defs>
                                    <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
