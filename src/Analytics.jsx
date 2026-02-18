import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BurgerMenu from './BurgerMenu';
import './Analytics.css';

import { auth, db } from './firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, getDocs, doc } from 'firebase/firestore';

const Analytics = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (user) {
                const q = query(collection(db, 'users', user.uid, 'entries'), orderBy('timestamp', 'desc'));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setEntries(data);
                });
                return () => unsubscribe();
            } else {
                setEntries([]);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    const formatTime = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const clearHistory = async () => {
        if (!auth.currentUser) return;

        if (window.confirm('Are you sure you want to clear your history? This cannot be undone.')) {
            try {
                const q = query(collection(db, 'users', auth.currentUser.uid, 'entries'));
                const snapshot = await getDocs(q);
                const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'users', auth.currentUser.uid, 'entries', d.id)));
                await Promise.all(deletePromises);
                // State updates automatically via onSnapshot
            } catch (error) {
                console.error("Error clearing history:", error);
                alert("Failed to clear history.");
            }
        }
    };

    const stripHtml = (html) => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    return (
        <div className="analytics-page">

            <header className="sanctuary-nav">
                <div className="nav-left">
                    <span className="sanctuary-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        The Desk
                    </span>
                </div>
                <div className="nav-right">
                    <button className="btn-secondary-fancy" onClick={clearHistory}>Clear History</button>
                    <button className="btn-secondary-fancy" onClick={() => navigate('/dashboard')}>Dashboard</button>
                    <BurgerMenu />
                </div>
            </header>

            <header className="analytics-header container">
                <h1 className="hero-title">Your <span className="gradient-text">Journey</span></h1>
                <p className="hero-description">A chronological archive of your intellectual reflections and creative expressions.</p>
            </header>

            <main className="container analytics-main">
                {entries.length === 0 ? (
                    <div className="glass-blur empty-state animate-up">
                        <p>Your sanctuary is empty. Start your first habit to see your progress here.</p>
                        <button className="btn-main-premium-lg" onClick={() => navigate('/select')}>Begin Your Journey</button>
                    </div>
                ) : (
                    <div className="entries-timeline">
                        {entries.map((entry, index) => (
                            <div
                                key={entry.id || index}
                                className={`glass-blur entry-card animate-up ${entry.type}`}
                                onClick={() => setSelectedEntry(entry)}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="entry-icon">
                                    {entry.type === 'reading' ? '📖' : '✒️'}
                                </div>
                                <div className="entry-content">
                                    <div className="entry-header">
                                        <span className="entry-type-label">{entry.type}</span>
                                        <span className="entry-date">{entry.date} • {formatTime(entry.timestamp)}</span>
                                    </div>

                                    {entry.type === 'reading' ? (
                                        <div className="reading-details">
                                            <h3>{entry.title}</h3>
                                            <p className="author">by {entry.author}</p>
                                            <div className="entry-stats">
                                                <span className="stat"><strong>{entry.pages}</strong> pages</span>
                                                <span className="stat"><strong>{entry.time}</strong> mins</span>
                                            </div>
                                            {entry.reflections && <p className="reflections">"{entry.reflections}"</p>}
                                        </div>
                                    ) : (
                                        <div className="writing-details">
                                            <h3>{entry.title || 'Untitled Entry'}</h3>
                                            <div className="entry-stats">
                                                <span className="stat"><strong>{entry.wordCount}</strong> words</span>
                                                <span className="stat"><em>{entry.mood}</em> vibe</span>
                                            </div>
                                            <p className="excerpt">{stripHtml(entry.content)}</p>
                                        </div>
                                    )}
                                </div>
                                {entry.type === 'writing' && entry.image && (
                                    <div className="entry-image-preview">
                                        <img src={entry.image} alt="Inspiration" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Detail Modal */}
            {selectedEntry && (
                <div className="modal-overlay" onClick={() => setSelectedEntry(null)}>
                    <div className="modal-content glass-blur animate-up" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedEntry(null)}>✕</button>

                        <div className="entry-header">
                            <span className={`entry-type-label ${selectedEntry.type}`}>{selectedEntry.type}</span>
                            <span className="entry-date">{selectedEntry.date} • {formatTime(selectedEntry.timestamp)}</span>
                        </div>

                        {selectedEntry.type === 'reading' ? (
                            <div className="modal-body">
                                <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{selectedEntry.title}</h1>
                                <p className="author" style={{ fontSize: '1.2rem' }}>by {selectedEntry.author}</p>

                                <div className="entry-stats" style={{ margin: '2rem 0', gap: '3rem' }}>
                                    <div className="stat">
                                        <p className="label">Pages Read</p>
                                        <strong>{selectedEntry.pages}</strong>
                                    </div>
                                    <div className="stat">
                                        <p className="label">Time Spent</p>
                                        <strong>{selectedEntry.time} mins</strong>
                                    </div>
                                </div>

                                <div className="full-text">
                                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Reflections</h3>
                                    <p>{selectedEntry.reflections || "No reflections recorded for this session."}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="modal-body">
                                <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{selectedEntry.title}</h1>
                                <div className="entry-header" style={{ marginBottom: '1rem' }}>
                                    <span className="mood-badge">{selectedEntry.mood} Vibe</span>
                                </div>
                                <div className="entry-stats" style={{ margin: '1.5rem 0' }}>
                                    <div className="stat">
                                        <p className="label">Word Count</p>
                                        <strong>{selectedEntry.wordCount} words</strong>
                                    </div>
                                    <div className="stat">
                                        <p className="label">Characters</p>
                                        <strong>{selectedEntry.charCount || 0}</strong>
                                    </div>
                                </div>

                                <div className="full-text writing-content" dangerouslySetInnerHTML={{ __html: selectedEntry.content }}>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
