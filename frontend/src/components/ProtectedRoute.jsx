import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, loginPath = '/login' }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to={loginPath} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // User not authorized for this role
        // If admin tries to access student page -> admin login (or dashboard)
        // If student tries to access admin page -> student login (or dashboard)
        // But better is to just send them to their respective "home".
        return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/student'} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
