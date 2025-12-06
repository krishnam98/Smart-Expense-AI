import { useSelector } from "react-redux";
import { WalletCards, Sparkles, BarChart3, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    const [activePage, setActivePage] = useState('dashboard');

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-pink-100 
        transform transition-transform duration-300 ease-in-out z-40
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full p-6">
                    {/* User Profile */}
                    <div className="flex items-center gap-3 mb-8 mt-12 lg:mt-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 shadow-lg flex items-center justify-center">
                            {user.profilePhoto ? (
                                <img src={user.profilePhoto} alt="avatar" className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                <Sparkles className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Hello,</span>
                            <span className="font-semibold text-base text-gray-800">{user.name || "Smart Saver"}</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2 flex-1">
                        <button
                            onClick={() => { navigate("/"); setActivePage('dashboard') }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activePage === 'dashboard'
                                ? 'bg-gradient-to-r from-pink-100 to-rose-100 text-rose-700 shadow-md'
                                : 'text-gray-600 hover:bg-pink-50'
                                }`}
                        >
                            <WalletCards className="w-5 h-5" />
                            <span>Dashboard</span>
                        </button>

                        <button
                            onClick={() => { navigate("/analytics"); setActivePage('analytics'); console.log("btn clicked") }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activePage === 'analytics'
                                ? 'bg-gradient-to-r from-pink-100 to-rose-100 text-rose-700 shadow-md'
                                : 'text-gray-600 hover:bg-pink-50'
                                }`}
                        >
                            <BarChart3 className="w-5 h-5" />
                            <span >Analytics</span>
                        </button>

                        <button
                            onClick={() => setActivePage('insights')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activePage === 'insights'
                                ? 'bg-gradient-to-r from-pink-100 to-rose-100 text-rose-700 shadow-md'
                                : 'text-gray-600 hover:bg-pink-50'
                                }`}
                        >
                            <TrendingUp className="w-5 h-5" />
                            <span>Insights</span>
                        </button>
                    </nav>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-pink-100">
                        <p className="text-sm font-semibold text-gray-800">Smart Expense AI</p>
                        <p className="text-xs text-gray-500">Track. Understand. Grow. ✨</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
