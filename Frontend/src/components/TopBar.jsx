import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice.js";
import { LogOut } from "lucide-react";

export default function TopBar() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const handleLogout = () => {
        console.log("Logging out...");
        dispatch(logout());

    };

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-pink-100">
            <div className="px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex flex-col ml-12 lg:ml-0">
                    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                        Smart Expense AI
                    </h1>
                    <p className="text-xs text-gray-500 hidden sm:block">Your radiant money companion ✨</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col text-right">
                        <span className="text-xs text-gray-500">Logged in as</span>
                        <span className="text-sm font-medium text-gray-700">{user.username}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 text-rose-700 text-sm font-medium transition-all shadow-sm hover:shadow"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
