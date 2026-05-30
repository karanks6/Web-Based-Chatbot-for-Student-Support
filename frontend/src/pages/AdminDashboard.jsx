import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import FAQManager from '../components/FAQManager';
import { LogOut, Users, MessageSquare, Database, X, ThumbsUp } from 'lucide-react';

const AdminDashboard = () => {
    // const { logout } = useAuth(); // Not used here anymore
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0, totalInteractions: 0, totalFAQs: 0,
        thumbsUpCount: 0, thumbsDownCount: 0, pendingCount: 0
    });
    const [unanswered, setUnanswered] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [replyingId, setReplyingId] = useState(null);

    // Modal States
    const [showUsersModal, setShowUsersModal] = useState(false);
    const [showInteractionsModal, setShowInteractionsModal] = useState(false);
    const [userList, setUserList] = useState([]);
    const [interactionStats, setInteractionStats] = useState([]);

    // Scroll Refs
    const faqRef = useRef(null);
    const pendingRef = useRef(null);

    const fetchAllStats = async () => {
        try {
            const statsRes = await api.get('/admin/stats');
            setStats(statsRes.data);

            const unansweredRes = await api.get('/admin/unanswered');
            setUnanswered(unansweredRes.data);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        }
    };

    useEffect(() => {
        fetchAllStats();
        const interval = setInterval(fetchAllStats, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUserList(res.data);
            setShowUsersModal(true);
        } catch (error) { console.error("Failed to fetch users", error); }
    };

    const fetchInteractions = async () => {
        try {
            const res = await api.get('/admin/interactions/summary');
            setInteractionStats(res.data);
            setShowInteractionsModal(true);
        } catch (error) { console.error("Failed to fetch interactions", error); }
    };


    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleReply = async (logId) => {
        try {
            await api.post(`/chat/reply/${logId}`, { reply: replyText });
            setUnanswered(prev => prev.filter(log => log.id !== logId));
            setReplyingId(null);
            setReplyText('');
            // setStats(prev => ({ ...prev, pendingCount: prev.pendingCount - 1 })); // Optimistic update
            fetchAllStats(); // Guaranteed update
            alert('Reply sent successfully!');
        } catch (error) {
            console.error("Failed to send reply", error);
            alert('Failed to send reply');
        }
    };

    const handleToggleUser = async (userId) => {
        if (!window.confirm("Are you sure you want to change this user's status?")) return;
        try {
            await api.put(`/admin/users/${userId}/status`);
            fetchUsers(); // Refresh list
        } catch (error) { console.error("Failed to toggle user", error); }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            fetchUsers(); // Refresh list
            fetchAllStats(); // Refresh main dashboard stats
        } catch (error) { console.error("Failed to delete user", error); }
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '2rem', position: 'relative' }}>
            {/* ... Modals will go here ... */}
            {showUsersModal && (
                <Modal title="All Users" onClose={() => setShowUsersModal(false)}>
                    {/* ... modal content ... */}
                    {userList.map(u => (
                        <div key={u.id} style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {u.username}
                                    {!u.active && <span style={{ fontSize: '0.7rem', background: 'var(--error)', padding: '2px 6px', borderRadius: '4px' }}>INACTIVE</span>}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{u.email}</div>
                                <div style={{ fontSize: '0.7rem', color: '#888' }}>Last Login: {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button
                                    onClick={() => handleToggleUser(u.id)}
                                    title={u.active ? "Deactivate" : "Activate"}
                                    style={{ background: u.active ? '#ffaa00' : 'green', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px' }}
                                >
                                    {u.active ? <X size={14} /> : <ThumbsUp size={14} />}
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    title="Delete"
                                    style={{ background: 'var(--error)', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px' }}
                                >
                                    <LogOut size={14} /> {/* Icon reuse for delete */}
                                </button>
                            </div>
                        </div>
                    ))}
                </Modal>
            )}

            {showInteractionsModal && (
                <Modal title="User Interactions" onClose={() => setShowInteractionsModal(false)}>
                    {interactionStats.map((s, idx) => (
                        <div key={idx} style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{s.username}</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{s.interactionCount}</span>
                        </div>
                    ))}
                </Modal>
            )}

            {/* Header Section */}
            <div style={{
                background: 'linear-gradient(135deg, var(--bg-card), rgba(0,0,0,0))',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Overview of system performance and user engagement</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatsCard title="Total Users" value={stats.totalUsers} color="var(--accent)" icon={<Users />} onClick={fetchUsers} />
                <StatsCard title="Interactions" value={stats.totalInteractions} color="var(--secondary)" icon={<MessageSquare />} onClick={fetchInteractions} />
                <StatsCard title="Active FAQs" value={stats.totalFAQs} color="var(--success)" icon={<Database />} onClick={() => scrollToSection(faqRef)} />
                <StatsCard title="Pending Queries" value={unanswered.length} color="var(--error)" icon={<MessageSquare />} onClick={() => scrollToSection(pendingRef)} />
            </div>

            {/* Simple Analytics Visual */}
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Engagement Overview</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '20px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {(() => {
                        const maxVal = Math.max(stats.thumbsUpCount, stats.thumbsDownCount, stats.pendingCount, 10);
                        return (
                            <>
                                <Bar bucket="Thumbs Up" value={stats.thumbsUpCount} max={maxVal} color="var(--success)" />
                                <Bar bucket="Thumbs Down" value={stats.thumbsDownCount} max={maxVal} color="var(--error)" />
                                <Bar bucket="Pending" value={stats.pendingCount} max={maxVal} color="#ff8a00" />
                            </>
                        );
                    })()}
                </div>
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem' }} ref={pendingRef}>
                <h3>Unanswered Student Queries</h3>
                {unanswered.length === 0 ? (
                    <p style={{ color: '#aaa', textAlign: 'center', padding: '1rem' }}>No pending queries. Great job!</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {unanswered.map(log => (
                            <div key={log.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                                        User: {log.user?.username || 'Unknown'}
                                        {log.session?.category && (
                                            <span style={{ marginLeft: '10px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', color: '#00d2ff', fontSize: '0.8rem' }}>
                                                {log.session.category}
                                            </span>
                                        )}
                                    </span>
                                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{new Date(log.timestamp).toLocaleString()}</span>
                                </div>
                                <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>"{log.userMessage}"</div>

                                {replyingId === log.id ? (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            className="input-field"
                                            style={{ margin: 0 }}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type your reply here..."
                                        />
                                        <button className="btn-primary" onClick={() => handleReply(log.id)}>Send</button>
                                        <button style={{ background: 'transparent', border: '1px solid #aaa', color: '#aaa', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }} onClick={() => setReplyingId(null)}>Cancel</button>
                                    </div>
                                ) : (
                                    <button
                                        style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                                        onClick={() => { setReplyingId(log.id); setReplyText(''); }}
                                    >
                                        Reply
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div ref={faqRef}>
                <FAQManager onUpdate={fetchAllStats} />
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, color, icon, onClick }) => (
    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', color: color }}>
            {icon}
        </div>
        <div>
            <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{value}</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{title}</p>
        </div>
    </div>
);

const Modal = ({ title, onClose, children }) => (
    <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.8)', zIndex: 1000,
        display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
        <div className="glass-card" style={{ width: '400px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                <h3>{title}</h3>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
            </div>
            <div style={{ overflowY: 'auto' }}>
                {children}
            </div>
        </div>
    </div>
);

const Bar = ({ bucket, value, max, color }) => {
    const height = Math.min((value / max) * 100, 100);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%' }}>
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <div style={{
                    width: '40px',
                    height: `${height === 0 ? 2 : height}%`,
                    background: color,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 1s ease',
                    opacity: 0.8,
                }}>
                </div>
            </div>
            <span style={{ marginTop: '5px', fontSize: '0.8rem', color: '#aaa', textAlign: 'center' }}>
                {bucket}<br />
                <span style={{ color: color, fontWeight: 'bold' }}>{value}</span>
            </span>
        </div>
    );
};

export default AdminDashboard;
