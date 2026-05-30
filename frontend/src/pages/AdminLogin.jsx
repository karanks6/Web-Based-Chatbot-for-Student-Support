import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(formData.username, formData.password);
            if (user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                setError('Access Denied: You do not have admin privileges.');
                // Optionally logout immediately if you want to prevent session creation for wrong role here
                // but AuthContext usually sets user. We might want to handle that. 
                // For now, simple error message.
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '400px' }}>
            <div className="glass-card" style={{ border: '1px solid #ff8a00' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(255, 138, 0, 0.1)', padding: '15px', borderRadius: '50%' }}>
                        <Shield size={40} color="#ff8a00" />
                    </div>
                    <h2 style={{ margin: 0 }}>Admin Login</h2>
                </div>

                {error && <div style={{
                    background: 'rgba(255, 68, 68, 0.1)',
                    color: 'var(--error)',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    border: '1px solid var(--error)'
                }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        className="input-field"
                        type="text"
                        name="username"
                        placeholder="Admin Username"
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
                    <button type="submit" className="btn-primary" style={{ width: '100%', background: 'linear-gradient(45deg, #ff8a00, #ff5f6d)' }}>
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
