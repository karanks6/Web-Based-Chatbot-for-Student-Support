import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationSystem = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user || user.role !== 'STUDENT') return;

        const checkNotifications = async () => {
            try {
                const res = await api.get('/chat/notifications');
                setNotifications(res.data);
            } catch (error) {
                // Silent fail
            }
        };

        checkNotifications();
        const interval = setInterval(checkNotifications, 30000); // Check every 30s

        return () => clearInterval(interval);
    }, [user]);

    const handleDismiss = async (logId) => {
        const notif = notifications.find(n => n.id === logId);
        try {
            await api.put(`/chat/notifications/${logId}/read`);
            setNotifications(prev => prev.filter(n => n.id !== logId));
            if (notif && notif.session && notif.session.id) {
                navigate(`/history?sessionId=${notif.session.id}`);
            } else {
                navigate('/history');
            }
        } catch (error) {
            console.error("Failed to dismiss notification", error);
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>
            {notifications.map(notif => (
                <div key={notif.id} style={{
                    background: '#1e1e2f',
                    border: '1px solid #e52e71',
                    borderRadius: '8px',
                    padding: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    maxWidth: '300px',
                    animation: 'slideIn 0.3s ease'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem', color: '#e52e71', fontWeight: 'bold' }}>
                        <Bell size={16} /> Admin Replied!
                    </div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#eee' }}>
                        "{notif.botResponse.substring(0, 50)}..."
                    </div>
                    <button
                        onClick={() => handleDismiss(notif.id)}
                        style={{
                            background: '#e52e71',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            width: '100%',
                            fontSize: '0.8rem'
                        }}
                    >
                        View Reply
                    </button>
                    <style>{`
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    `}</style>
                </div>
            ))}
        </div>
    );
};

export default NotificationSystem;
