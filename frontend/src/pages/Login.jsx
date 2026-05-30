import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminLogin = location.state?.isAdminLogin;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(formData.username, formData.password);
            if (user.role === 'ADMIN') {
                setError('Admins must use the Admin Login page.');
                // Optionally auto-redirect or clear session
            } else {
                navigate('/student');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '400px' }}>
            <div className="glass-card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
                {error && <p style={{ color: 'var(--error)', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        className="input-field"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="input-field"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        Login
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
