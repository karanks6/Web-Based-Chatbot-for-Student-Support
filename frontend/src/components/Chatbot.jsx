import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Send, User, Bot, Loader, ThumbsUp, ThumbsDown, FileText, CreditCard, UserPlus, BookOpen, Home as HomeIcon, HelpCircle } from 'lucide-react';
import QuickButtons from './QuickButtons';

const Chatbot = () => {
    const [messages, setMessages] = useState([]); // Empty initially
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [category, setCategory] = useState(null);
    const messagesEndRef = useRef(null);

    const categories = ["Exams", "Fees", "Admissions", "Courses", "Hostel", "Other"];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, category]);

    const startSession = async (selectedCategory) => {
        setIsTyping(true);
        try {
            const res = await api.post('/chat/start', { category: selectedCategory });
            setSessionId(res.data.id);
            setCategory(selectedCategory);
            // Wait a tick to ensure component re-render if needed, but not strictly necessary with React state batching
            setMessages([{ sender: 'bot', text: `Hello! You selected ${selectedCategory}. How can I help you regarding that?` }]);
        } catch (error) {
            console.error("Failed to start session", error);
            alert("Failed to start chat. Please try again."); // Simple feedback
        } finally {
            setIsTyping(false);
        }
    };

    const handleFeedback = async (logId, isHelpful) => {
        try {
            await api.put(`/chat/feedback/${logId}?helpful=${isHelpful}`);
            setMessages(prev => prev.map(msg =>
                msg.logId === logId ? { ...msg, feedback: isHelpful } : msg
            ));
        } catch (error) {
            console.error("Feedback failed", error);
        }
    };

    const handleSend = async (e) => {
        e && e.preventDefault();
        if (!input.trim() || !sessionId) return;

        const userMsg = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await api.post('/chat', { message: userMsg.text, sessionId });
            const botMsg = { sender: 'bot', text: response.data.response, logId: response.data.logId };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, server error.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    // Quick Connect for "handleQuickSelect" from QuickButtons
    const handleQuickSelect = (query) => {
        setInput(query);
        // Note: For now, we need to click send manually or we could just invoke handleSend logic directly
        // But handleSend needs event or just extract logic. 
        // Let's just set input for UX or trigger send if ready.
        // Actually, let's trigger send immediately if we modify handleSend to be reusable
    };

    // Auto-send effect if needed, but let's stick to simple input fill for now

    if (!category) {
        return (
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem', paddingTop: '3rem', justifyContent: 'flex-start', alignItems: 'center' }}>
                <h3 style={{ marginBottom: '1rem' }}>What do you need help with?</h3>
                {isTyping ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <Loader className="animate-spin" size={32} />
                        <p>Starting session...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', width: '100%', maxWidth: '600px' }}>
                        {categories.map(cat => {
                            const config = {
                                "Exams": { icon: <FileText size={20} />, color: "#ff4444" },
                                "Fees": { icon: <CreditCard size={20} />, color: "#00d4ff" },
                                "Admissions": { icon: <UserPlus size={20} />, color: "#3ecf8e" },
                                "Courses": { icon: <BookOpen size={20} />, color: "#FFD700" },
                                "Hostel": { icon: <HomeIcon size={20} />, color: "#9c27b0" },
                                "Other": { icon: <HelpCircle size={20} />, color: "#ff8a00" }
                            }[cat] || { icon: <HelpCircle size={20} />, color: "#ccc" };

                            return (
                                <button
                                    key={cat}
                                    onClick={() => startSession(cat)}
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '0.8rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.borderColor = config.color;
                                        e.currentTarget.style.boxShadow = `0 6px 12px -3px ${config.color}33`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        color: config.color,
                                        background: `${config.color}15`,
                                        padding: '8px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {config.icon}
                                    </div>
                                    <span style={{
                                        color: '#E0E0E0',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {cat}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Support: {category}</h3>
                <button onClick={() => setCategory(null)} style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer' }}>Change Topic</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-start',
                        gap: '10px'
                    }}>
                        {msg.sender === 'bot' && <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '50%', height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={18} /></div>}
                        <div style={{
                            background: msg.sender === 'user' ? 'linear-gradient(90deg, #ff5f6d, var(--primary))' : 'rgba(255,255,255,0.1)',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            maxWidth: '70%',
                            lineHeight: '1.5',
                            position: 'relative'
                        }}>
                            {msg.text}
                            {msg.sender === 'bot' && msg.logId && (
                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end', opacity: 1 }}>
                                    <button
                                        onClick={() => handleFeedback(msg.logId, true)}
                                        style={{
                                            background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px',
                                            color: msg.feedback === true ? 'var(--success)' : '#ccc',
                                            transition: 'color 0.2s'
                                        }}
                                        title="Helpful"
                                    >
                                        <ThumbsUp size={14} fill={msg.feedback === true ? 'var(--success)' : 'none'} />
                                    </button>
                                    <button
                                        onClick={() => handleFeedback(msg.logId, false)}
                                        style={{
                                            background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px',
                                            color: msg.feedback === false ? '#ff4444' : '#ccc',
                                            transition: 'color 0.2s'
                                        }}
                                        title="Not Helpful"
                                    >
                                        <ThumbsDown size={14} fill={msg.feedback === false ? '#ff4444' : 'none'} />
                                    </button>
                                </div>
                            )}
                        </div>
                        {msg.sender === 'user' && <div style={{ background: '#444', padding: '8px', borderRadius: '50%', height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={18} /></div>}
                    </div>
                ))}
                {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '50%', height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={18} /></div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '12px' }}>
                            <Loader className="animate-spin" size={16} /> Typing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '1rem' }}>
                <input
                    className="input-field"
                    style={{ margin: 0 }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Send size={18} /> Send
                </button>
            </form>
        </div>
    );
};

export default Chatbot;
