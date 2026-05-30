import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Bot, User, Clock } from 'lucide-react';

const ChatHistory = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/chat/history');
                setLogs(res.data);
            } catch (err) {
                console.error("Failed to fetch history");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div>Loading history...</div>;

    return (
        <div style={{ height: '600px', overflowY: 'auto' }} className="glass-card">
            <h3>Your Conversation History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {logs.map(log => (
                    <div key={log.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.5rem' }}>
                            <Clock size={14} /> {new Date(log.timestamp).toLocaleString()}
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#ff8a00' }}>You:</strong> {log.userMessage}
                        </div>
                        <div>
                            <strong style={{ color: '#e52e71' }}>Bot:</strong> {log.botResponse}
                        </div>
                    </div>
                ))}
            </div>
            {logs.length === 0 && <p>No history found.</p>}
        </div>
    );
};

export default ChatHistory;
