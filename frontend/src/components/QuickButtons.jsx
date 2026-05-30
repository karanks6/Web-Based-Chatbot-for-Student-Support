import React from 'react';

const QuickButtons = ({ onSelect }) => {
    const suggestions = [
        { label: '📘 Exam Dates', query: 'When are the exams?' },
        { label: '💰 Fee Structure', query: 'What is the fee structure?' },
        { label: '🏫 Admission Process', query: 'How do I apply for admission?' },
        { label: '🏠 Hostel Facilities', query: 'Is there a hostel facility?' },
        { label: '📅 Academic Calendar', query: 'Show me the academic calendar' }
    ];

    return (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '0.5rem 1.5rem 0' }}>
            {suggestions.map((item, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(item.query)}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '20px',
                        padding: '0.5rem 1rem',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default QuickButtons;
