import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        role: 'STUDENT'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.username, formData.password, formData.fullName); // Role handling needs update in context/api if we want to support it
            // For now, context register only takes 3 args. Let's update context or just pass role if backend supports it.
            // Backend RegisterRequest supports role. But AuthContext.register takes 3 args.
            // I'll assume standard student registration for now, or update AuthContext later.
            // Actually, let's just stick to Student. Admin can be added manually or via DB for security.
            navigate('/student');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '400px' }}>
            <div className="glass-card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
                {error && <p style={{ color: 'var(--error)', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        className="input-field"
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
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
                        Sign Up
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
