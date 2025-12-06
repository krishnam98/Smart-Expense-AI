import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-rose-50">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-pink-100"
            >
                {sidebarOpen ? (
                    <X className="w-5 h-5 text-rose-600" />
                ) : (
                    <Menu className="w-5 h-5 text-rose-600" />
                )}
            </button>

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <div className="flex-1 lg:ml-64">
                    <TopBar />
                    <main className="p-4 md:p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
