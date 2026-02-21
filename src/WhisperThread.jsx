import React, { useState, useEffect, useRef } from 'react';
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
    const [shadowText, setShadowText] = useState('');
    const scrollRef = useRef(null);

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
        const q = query(collection(db, 'users', uid, 'entries'), orderBy('timestamp', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => d.data());
        setEntries(data);

        // Prepare some random "shadow" text from past entries
        if (data.length > 0) {
            const randomEntry = data[Math.floor(Math.random() * data.length)];
            const text = randomEntry.type === 'writing' ?
                extractTextFromHtml(randomEntry.content) :
                randomEntry.reflections || randomEntry.title;
            setShadowText(text.slice(0, 300));
        }
    };

    const extractTextFromHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const generateWhisper = () => {
        if (entries.length < 2) {
            alert("The Shadow needs more of your history to find a dialogue. Keep reading and writing!");
            return;
        }

        setIsGenerating(true);

        // Simulate AI thinking and shadow movement
        setTimeout(() => {
            const recent = entries.slice(0, 5);
            const past = entries.slice(10, 30);

            let newWhisper = "";

            if (past.length > 0) {
                const pastEntry = past[Math.floor(Math.random() * past.length)];
                const recentEntry = recent[Math.floor(Math.random() * recent.length)];

                const dialogues = [
                    `I remember when I was obsessed with "${pastEntry.title}" a while ago. Seeing me work on "${recentEntry.title}" now, I can see how far my perspective has shifted.`,
                    `The questions I asked back during "${pastEntry.title}" are finally being answered in "${recentEntry.title}". I've grown more than I realized.`,
                    `I was much more rigid when I wrote/read "${pastEntry.title}". In "${recentEntry.title}", I sense a new kind of creative freedom.`,
                    `It's strange... the themes from my time with "${pastEntry.title}" are still echoing in "${recentEntry.title}". Some parts of me never change.`,
                    `I was searching for something during "${pastEntry.title}". I think I found a piece of it today in "${recentEntry.title}".`
                ];
                newWhisper = dialogues[Math.floor(Math.random() * dialogues.length)];
            } else {
                // Fallback for newer users
                const e1 = entries[0];
                const e2 = entries[1];
                newWhisper = `I see a thread connecting "${e1.title}" to "${e2.title}". My mind is building a bridge between these two worlds.`;
            }

            const whisperObj = {
                id: Date.now(),
                text: newWhisper,
                date: new Date().toLocaleDateString(),
                type: 'shadow'
            };

            setWhispers([whisperObj, ...whispers]);
            setIsGenerating(false);

            // Randomize shadow text for next time
            const nextShadowEntry = entries[Math.floor(Math.random() * entries.length)];
            const nextText = nextShadowEntry.type === 'writing' ?
                extractTextFromHtml(nextShadowEntry.content) :
                nextShadowEntry.reflections || nextShadowEntry.title;
            setShadowText(nextText.slice(0, 300));

        }, 3000);
    };

    return (
        <div className="whisper-page shadow-theme">
            <Header title="The Shadow Dialogue" showBack={true} />

            <div className="shadow-background">
                <div className="moving-shadow-text">{shadowText}</div>
            </div>

            <main className="whisper-container container animate-up">
                <div className="whisper-hero">
                    <div className="orb-wrapper">
                        <div className={`shadow-orb ${isGenerating ? 'active' : ''}`}>
                            <div className="inner-shadow"></div>
                        </div>
                    </div>
                    <h1>Converse with <span className="gradient-text">Past Self</span></h1>
                    <p>Listen to the echoes of your own evolution as a reader and writer.</p>

                    <button
                        className="btn-shadow-action"
                        onClick={generateWhisper}
                        disabled={isGenerating}
                    >
                        {isGenerating ? "Summoning Shadow..." : "Invoke Dialogue"}
                    </button>
                </div>

                <div className="whispers-list" ref={scrollRef}>
                    {whispers.map((w, index) => (
                        <div key={w.id} className="whisper-card shadow-card animate-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="whisper-avatar">👤</div>
                            <div className="whisper-content">
                                <p className="whisper-text">"{w.text}"</p>
                                <span className="whisper-meta">{w.date} • Your Shadow</span>
                            </div>
                        </div>
                    ))}

                    {whispers.length === 0 && !isGenerating && (
                        <div className="whisper-empty shadow-empty">
                            <p>No dialogue has been summoned. The shadow is waiting.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default WhisperThread;
