import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

const FAQManager = ({ onUpdate }) => {
    const [faqs, setFaqs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ question: '', answer: '', keywords: '', category: '' });
    const [isAdding, setIsAdding] = useState(false);

    const fetchFaqs = async () => {
        const res = await api.get('/faqs');
        setFaqs(res.data);
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Delete this FAQ?')) {
            await api.delete(`/faqs/${id}`);
            fetchFaqs();
            if (onUpdate) onUpdate();
        }
    };

    const handleEdit = (faq) => {
        setEditingId(faq.id);
        setFormData({ question: faq.question, answer: faq.answer, keywords: faq.keywords, category: faq.category });
        setIsAdding(false);
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await api.put(`/faqs/${editingId}`, formData);
            } else {
                await api.post('/faqs', formData);
            }
            fetchFaqs();
            setEditingId(null);
            setIsAdding(false);
            setFormData({ question: '', answer: '', keywords: '', category: '' });
            if (onUpdate) onUpdate();
        } catch (err) {
            alert('Failed to save FAQ');
        }
    };

    return (
        <div className="glass-card" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>FAQ Management</h3>
                {!isAdding && !editingId && (
                    <button className="btn-primary" onClick={() => { setIsAdding(true); setFormData({ question: '', answer: '', keywords: '', category: '' }); }}>
                        <Plus size={16} /> Add FAQ
                    </button>
                )}
            </div>

            {(isAdding || editingId) && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <select
                        className="input-field"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        style={{ marginTop: '0', background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                    >
                        <option value="" disabled>Select Category</option>
                        <option value="Exams" style={{ color: 'black' }}>Exams</option>
                        <option value="Fees" style={{ color: 'black' }}>Fees</option>
                        <option value="Admissions" style={{ color: 'black' }}>Admissions</option>
                        <option value="Courses" style={{ color: 'black' }}>Courses</option>
                        <option value="Hostel" style={{ color: 'black' }}>Hostel</option>
                        <option value="Other" style={{ color: 'black' }}>Other</option>
                    </select>
                    <input className="input-field" placeholder="Question" value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} />
                    <textarea className="input-field" placeholder="Answer" rows="3" value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} />
                    <input className="input-field" placeholder="Keywords (comma separated)" value={formData.keywords} onChange={e => setFormData({ ...formData, keywords: e.target.value })} />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary" onClick={handleSave}><Save size={16} /> Save</button>
                        <button className="btn-primary" style={{ background: '#555' }} onClick={() => { setEditingId(null); setIsAdding(false); }}><X size={16} /> Cancel</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {faqs.map(faq => (
                    <div key={faq.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: '#00d2ff', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{faq.category}</div>
                            <div style={{ fontWeight: 'bold', color: '#ff8a00' }}>Q: {faq.question}</div>
                            <div style={{ marginTop: '0.5rem' }}>A: {faq.answer}</div>
                            <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.5rem' }}>Keywords: {faq.keywords}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <button onClick={() => handleEdit(faq)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}><Edit size={18} /></button>
                            <button onClick={() => handleDelete(faq.id)} style={{ background: 'none', border: 'none', color: 'tomato', cursor: 'pointer' }}><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQManager;
