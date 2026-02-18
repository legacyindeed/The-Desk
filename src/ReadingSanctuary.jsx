import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReadingSanctuary.css';

import { db, auth } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const ReadingSanctuary = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [pages, setPages] = useState('');
    const [time, setTime] = useState('');
    const [reflections, setReflections] = useState('');

    const handleSave = async () => {
        if (!auth.currentUser) {
            alert('You must be logged in to save entries.');
            return;
        }

        const entry = {
            id: Date.now(), // Still useful for keying
            type: 'reading',
            title,
            author,
            pages,
            time,
            reflections,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            timestamp: new Date().toISOString()
        };

        try {
            await addDoc(collection(db, 'users', auth.currentUser.uid, 'entries'), entry);

            // Optional: Keep local storage sync or remove it. 
            // For now, removing local storage write to fully switch to cloud.
            navigate('/analytics');
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Failed to save entry. Please try again.");
        }
    };

    return (
        <div className="sanctuary-page">
            <header className="sanctuary-nav">
                <div className="nav-left">
                    <button className="btn-back-fancy" onClick={() => navigate('/dashboard')}>
                        <span>←</span> Back
                    </button>
                    <span className="sanctuary-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer', marginLeft: '2rem' }}>
                        The Desk
                    </span>
                </div>
            </header>

            <main className="container sanctuary-main animate-up">
                <div className="reading-form-card glass-blur">
                    <h1>Reading Session</h1>
                    <p className="subtitle">Archive your insights and mindful reflections.</p>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Book / Article Title</label>
                            <input
                                type="text"
                                placeholder="What are you exploring?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Author / Source</label>
                            <input
                                type="text"
                                placeholder="Who is the voice?"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Pages Consumed</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={pages}
                                onChange={(e) => setPages(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Minutes of Focus</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '2rem' }}>
                        <label>Your Reflections</label>
                        <textarea
                            placeholder="What thoughts did this session spark?"
                            style={{ minHeight: '150px' }}
                            value={reflections}
                            onChange={(e) => setReflections(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="form-footer">
                        <button className="btn-main-premium-lg" onClick={handleSave}>
                            Archive Session
                        </button>
                    </div>
                </div>

                <div className="sanctuary-quote" style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.6 }}>
                    <p className="quote-text" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.2rem' }}>
                        "Reading is a conversation. All books talk. But a good book listens as well."
                    </p>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>— Mark Haddon</span>
                </div>
            </main>
        </div>
    );
};

export default ReadingSanctuary;
