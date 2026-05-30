import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Shield, Home as HomeIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textDecoration: 'none', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    StudentHelp<span style={{ color: '#e52e71' }}>Bot</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {!user ? (
                    <>
                        <Link to="/" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <HomeIcon size={18} /> Home
                        </Link>
                        <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
                        <Link to="/admin-login" style={{
                            color: '#ff8a00',
                            textDecoration: 'none',
                            border: '1px solid #ff8a00',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <Shield size={16} /> Admin Page
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/profile" style={{ color: '#4caf50', textDecoration: 'none' }}>Profile</Link>
                        {user.role === 'ADMIN' && (
                            <Link to="/admin" style={{ color: '#ff8a00', textDecoration: 'none' }}>Admin Dashboard</Link>
                        )}
                        {user.role === 'STUDENT' && (
                            <>
                                <Link to="/student" style={{ color: '#e52e71', textDecoration: 'none' }}>Dashboard</Link>
                                <Link to="/history" style={{ color: '#fff', textDecoration: 'none' }}>History</Link>
                            </>
                        )}
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
