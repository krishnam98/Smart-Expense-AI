import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { token, loading } = useSelector((state) => state.auth);

    // Show loader while verifying auth (fixes white flash)
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-gray-200">
                Loading...
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
