import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { MessageSquare, Clock, ArrowRight } from 'lucide-react';

const HistoryPage = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await api.get('/chat/sessions');
            setSessions(res.data);

            const paramSessionId = searchParams.get('sessionId');
            if (paramSessionId) {
                const sessionToSelect = res.data.find(s => s.id === parseInt(paramSessionId));
                if (sessionToSelect) {
                    fetchMessages(sessionToSelect.id, sessionToSelect);
                }
            } else if (res.data.length > 0) {
                // Optional: Select first by default if needed
            }
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        }
    };

    const fetchMessages = async (sessionId, sessionObject = null) => {
        setLoading(true);
        try {
            const res = await api.get(`/chat/sessions/${sessionId}`);
            setMessages(res.data);

            // Use passed object or find in state
            const session = sessionObject || sessions.find(s => s.id === sessionId);
            setSelectedSession(session);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: 'calc(100vh - 100px)', gap: '1.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
            {/* Sidebar List */}
            <div className="glass-card" style={{ width: '320px', flexShrink: 0, padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={20} color="var(--accent)" /> History
                    </h3>
                </div>

                <div style={{ overflowY: 'auto', flex: 1, padding: '1rem' }}>
                    {sessions.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                            <p style={{ marginBottom: '0.5rem' }}>No conversations yet.</p>
                            <small>Start a new chat from the dashboard.</small>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {sessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => fetchMessages(session.id)}
                                style={{
                                    padding: '1rem',
                                    background: selectedSession?.id === session.id ? 'linear-gradient(90deg, rgba(229, 46, 113, 0.15), transparent)' : 'transparent',
                                    borderLeft: selectedSession?.id === session.id ? '3px solid var(--accent)' : '3px solid transparent',
                                    borderRadius: '0 8px 8px 0',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                className="history-item"
                            >
                                <div style={{ fontWeight: '600', color: selectedSession?.id === session.id ? '#fff' : '#ccc', marginBottom: '4px' }}>
                                    {session.category} Support
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Clock size={10} /> {new Date(session.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat View */}
            <div className="glass-card" style={{ width: '900px', flexShrink: 0, padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '16px', background: 'rgba(20, 20, 20, 0.6)' }}>
                {selectedSession ? (
                    <>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ margin: '0 0 5px 0', fontSize: '1.3rem' }}>{selectedSession.category}</h2>
                                <span style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Started on {new Date(selectedSession.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div style={{ padding: '5px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {messages.length} messages
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {messages.map((msg, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    width: '100%'
                                }}>
                                    {/* User Message */}
                                    {msg.userMessage && (
                                        <div style={{ maxWidth: '70%', alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <div style={{
                                                background: 'linear-gradient(135deg, #ff8a00, #e52e71)',
                                                padding: '14px 20px',
                                                borderRadius: '20px 20px 4px 20px',
                                                color: 'white',
                                                boxShadow: '0 4px 15px rgba(229, 46, 113, 0.2)',
                                                marginBottom: '5px'
                                            }}>
                                                {msg.userMessage}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#555', textAlign: 'right', paddingRight: '5px' }}>
                                                You
                                            </div>
                                        </div>
                                    )}

                                    {/* Bot Response */}
                                    {msg.botResponse && (
                                        <div style={{ maxWidth: '70%', alignSelf: 'flex-start' }}>
                                            <div style={{
                                                background: '#2a2a2a',
                                                padding: '14px 20px',
                                                borderRadius: '20px 20px 20px 4px',
                                                color: '#eee',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                                marginBottom: '5px'
                                            }}>
                                                {msg.botResponse}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#555', paddingLeft: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                StudentHelpBot
                                                <span style={{ width: '4px', height: '4px', background: '#ccc', borderRadius: '50%' }}></span>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ padding: '2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }}>
                            <MessageSquare size={64} opacity={0.3} />
                        </div>
                        <div style={{ fontSize: '1.1rem' }}>Select a conversation from the sidebar to view details.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
