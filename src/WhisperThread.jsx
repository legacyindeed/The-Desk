import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { auth, db } from './firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import './WhisperThread.css';

const WhisperThread = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [whispers, setWhispers] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(currentUser => {
            if (currentUser) {
                setUser(currentUser);
                fetchEntries(currentUser.uid);
            } else {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchEntries = async (uid) => {
        const q = query(collection(db, 'users', uid, 'entries'), orderBy('timestamp', 'desc'), limit(20));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => d.data());
        setEntries(data);
    };

    const generateWhisper = () => {
        if (entries.length < 2) {
            alert("The Whisper needs at least two entries to find a thread. Keep reading and writing!");
            return;
        }

        setIsGenerating(true);

        // Simulate AI thinking
        setTimeout(() => {
            const readingEntries = entries.filter(e => e.type === 'reading');
            const writingEntries = entries.filter(e => e.type === 'writing');

            let newWhisper = "";

            if (readingEntries.length > 0 && writingEntries.length > 0) {
                const read = readingEntries[Math.floor(Math.random() * readingEntries.length)];
                const write = writingEntries[Math.floor(Math.random() * writingEntries.length)];

                const connections = [
                    `The intellectual rigor you found in "${read.title}" is manifesting in the clarity of your writing about "${write.title}".`,
                    `There is a subtle bridge between the themes of "${read.title}" and the emotional frequency of your session "${write.title}".`,
                    `Your subconscious is echoing the wisdom of "${read.author}" within your recent creative reflections.`,
                    `Notice how the quiet focus of your reading session for "${read.title}" fueled the word count of "${write.wordCount}" in your next session.`
                ];
                newWhisper = connections[Math.floor(Math.random() * connections.length)];
            } else if (writingEntries.length >= 2) {
                const e1 = writingEntries[0];
                const e2 = writingEntries[1];
                newWhisper = `A pattern is emerging between "${e1.title}" and "${e2.title}". Your voice is becoming more distinct.`;
            } else if (readingEntries.length >= 2) {
                const e1 = readingEntries[0];
                const e2 = readingEntries[1];
                newWhisper = `The dialogue between "${e1.title}" and "${e2.title}" in your mind is creating a new field of knowledge.`;
            }

            const whisperObj = {
                id: Date.now(),
                text: newWhisper,
                date: new Date().toLocaleDateString(),
                type: 'connection'
            };

            setWhispers([whisperObj, ...whispers]);
            setIsGenerating(false);
        }, 2500);
    };

    return (
        <div className="whisper-page">
            <Header title="The Whisper Thread" showBack={true} />

            <main className="whisper-container container animate-up">
                <div className="whisper-hero">
                    <div className="whisper-orb-container">
                        <div className={`whisper-orb ${isGenerating ? 'generating' : ''}`}></div>
                    </div>
                    <h1>Listen to the <span className="gradient-text">Silence</span></h1>
                    <p>The AI Intellectual Partner that finds the hidden threads in your journey.</p>

                    <button
                        className="btn-main-premium whisper-action-btn"
                        onClick={generateWhisper}
                        disabled={isGenerating}
                    >
                        {isGenerating ? "Listening..." : "Seek Connection"}
                    </button>
                </div>

                <div className="whispers-list">
                    {whispers.map((w, index) => (
                        <div key={w.id} className="whisper-card animate-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="whisper-icon">✨</div>
                            <div className="whisper-content">
                                <p className="whisper-text">{w.text}</p>
                                <span className="whisper-date">{w.date} • Intellectual Connection</span>
                            </div>
                        </div>
                    ))}

                    {whispers.length === 0 && !isGenerating && (
                        <div className="whisper-empty">
                            <p>No whispers yet. Summon a connection to begin.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default WhisperThread;
