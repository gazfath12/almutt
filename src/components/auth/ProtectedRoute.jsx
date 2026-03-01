import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function ProtectedRoute() {
    const { user } = useAuth();

    if (!user) {
        // If not logged in, redirect to login page
        return <Navigate to="/admin/login" replace />;
    }

    // If logged in, render child routes
    return <Outlet />;
}
