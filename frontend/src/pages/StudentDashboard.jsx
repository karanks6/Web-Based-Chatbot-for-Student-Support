import { useState, useEffect } from 'react';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = date.getHours();
    let greeting = 'Good Morning';
    if (hours >= 12 && hours < 17) greeting = 'Good Afternoon';
    if (hours >= 17) greeting = 'Good Evening';

    return (
        <div style={{
            width: '100%',
            height: 'calc(100vh - 80px)', // Adjust for navbar
            paddingTop: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            paddingBottom: '2rem',
            boxSizing: 'border-box'
        }}>
            {/* Hero / Welcome Section */}
            <div style={{
                width: '90%',
                maxWidth: '1200px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 1rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '700', background: 'linear-gradient(90deg, #fff, #ccc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {greeting}, {user?.fullName?.split(' ')[0] || 'Student'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>How can we help you succeed today?</p>
                </div>

                <div className="glass-card" style={{ padding: '1rem 2rem', display: 'flex', gap: '2rem', borderRadius: '50px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Clock size={20} color="var(--primary)" />
                        <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={20} color="var(--accent)" />
                        <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                            {date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Chat Hub */}
            <div style={{
                width: '750px', // Reduced width as requested
                flex: 1,
                minHeight: 0, // Critical for flex child scrolling
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-20px', left: '-20px', right: '-20px', bottom: '-20px',
                    background: 'var(--primary)',
                    opacity: 0.05,
                    filter: 'blur(40px)',
                    zIndex: -1,
                    borderRadius: '30px'
                }}></div>

                <div className="glass-card" style={{
                    height: '100%',
                    padding: 0,
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}>
                    <Chatbot />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
