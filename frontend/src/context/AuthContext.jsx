import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on load
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, ...userData } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const register = async (username, password, fullName) => {
        try {
            const response = await api.post('/auth/register', { username, password, fullName });
            // Usually register also logs in or returns same data
            const { token, ...userData } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
