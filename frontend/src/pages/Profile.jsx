import { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Save, Clock, Mail, Hash } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        studentId: '',
        lastLogin: '',
        role: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/user/profile');
                setProfile(res.data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div>Loading...</div>;

    return (
        <div style={{ width: '100%', height: 'calc(100vh - 100px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                <div style={{ background: 'var(--accent)', padding: '20px', borderRadius: '50%', display: 'inline-flex', marginBottom: '1.5rem' }}>
                    <User size={48} color="#fff" />
                </div>

                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{profile.fullName || profile.username}</h2>
                <span style={{ color: '#aaa', display: 'block', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{profile.role}</span>

                {profile.role !== 'ADMIN' && (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                        <Mail size={20} color="var(--primary)" />
                        <span style={{ fontSize: '1.1rem' }}>{profile.email || profile.username}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
