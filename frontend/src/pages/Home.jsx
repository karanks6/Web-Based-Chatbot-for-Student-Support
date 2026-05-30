import { useNavigate } from 'react-router-dom';
import { MessageSquare, Shield, Zap, BookOpen, Clock, Lock, Globe } from 'lucide-react';
import { useState } from 'react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050505', overflowX: 'hidden' }}>

            {/* Split Hero Section */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 8%',
                minHeight: '80vh',
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundSize: '40px 40px',
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    pointerEvents: 'none'
                }}></div>

                {/* Left Content */}
                <div style={{ flex: '1 1 500px', zIndex: 2, paddingRight: '2rem' }}>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                        fontWeight: '900',
                        lineHeight: '1.1',
                        marginBottom: '1.5rem',
                        color: '#fff',
                        textShadow: '0 0 20px rgba(0,0,0,0.5)'
                    }}>
                        Answers in a <br />
                        <span style={{ color: '#e52e71' }}>Flash.</span>
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'rgba(255,255,255,0.8)',
                        maxWidth: '550px',
                        marginBottom: '3rem',
                        lineHeight: '1.7'
                    }}>
                        Navigate your academic journey with instant, accurate, and 24/7 support. The smart chatbot designed for the modern student.
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.2rem', borderRadius: '50px' }} onClick={() => navigate('/register')}>
                            Get Started Now
                        </button>
                        <button style={{
                            padding: '16px 40px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            backdropFilter: 'blur(5px)',
                            transition: 'all 0.3s ease'
                        }} onClick={() => navigate('/login')}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            Log In
                        </button>
                    </div>
                </div>

                {/* Right Content - Abstract Visual */}
                <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: '400px' }}>
                    <div style={{
                        width: '350px',
                        height: '450px',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.0))',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.18)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: 'rotate(-5deg)',
                        zIndex: 1
                    }}>
                        <MessageSquare size={80} color="#e52e71" style={{ marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Ask Me.</h2>
                        <p style={{ color: '#aaa' }}>Anything, anytime.</p>
                    </div>
                    <div style={{
                        position: 'absolute',
                        width: '350px',
                        height: '450px',
                        background: '#e52e71',
                        borderRadius: '20px',
                        opacity: 0.2,
                        transform: 'rotate(5deg) scale(0.9)',
                        zIndex: 0
                    }}></div>
                </div>
            </div>

            {/* Flash Cards Features Section */}
            <div style={{ padding: '6rem 2rem', background: 'linear-gradient(180deg, #020203 0%, #0c0c16 100%)' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Key Features</h2>
                    <p style={{ color: '#888', fontSize: '1.2rem' }}>Hover over the cards to reveal details</p>
                </div>

                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    perspective: '1000px' // Essential for 3D flip
                }}>
                    <FlashCard
                        icon={<Zap size={48} color="#FFD700" />}
                        title="Lightning Fast"
                        desc="Get answers in milliseconds. Our optimized engine ensures you never have to wait for the information you need."
                    />
                    <FlashCard
                        icon={<Clock size={48} color="#00d4ff" />}
                        title="24/7 Availability"
                        desc="Learning never sleeps, and neither do we. Access support at 3 AM or 3 PM, whenever you need it most."
                    />
                    <FlashCard
                        icon={<Lock size={48} color="#ff4444" />}
                        title="Secure & Private"
                        desc="Your privacy is paramount. All interactions are encrypted and anonymous ensuring a safe environment for your queries."
                    />
                    <FlashCard
                        icon={<Globe size={48} color="#3ecf8e" />}
                        title="Knowledge Hub"
                        desc="A centralized repository for exams, fees, courses, and campus events. Everything you need in one place."
                    />
                </div>
            </div>

            {/* Simple Footer */}
            <div style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#444' }}>
                © 2025 StudentHelpBot. All rights reserved.
            </div>
        </div>
    );
};

const FlashCard = ({ icon, title, desc }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{ width: '100%', height: '350px', position: 'relative', cursor: 'pointer' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s',
                transform: isHovered ? 'rotateY(180deg) scale(0.95)' : 'rotateY(0deg) scale(1)',
            }}>
                {/* Front of Card */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: '#151520',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                }}>
                    <div style={{ marginBottom: '1.5rem', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}>
                        {icon}
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h3>
                </div>

                {/* Back of Card */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(145deg, #1e1e2f, #2a2a3e)',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: 'rotateY(180deg)',
                    padding: '2rem',
                    textAlign: 'center',
                    border: '1px solid #e52e71', // Accent border on back
                    boxShadow: '0 10px 15px -3px rgba(229, 46, 113, 0.2)'
                }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#e52e71' }}>{title}</h3>
                    <p style={{ lineHeight: '1.6', color: '#ccc' }}>{desc}</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
