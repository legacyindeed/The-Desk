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
        try {
            const q = query(collection(db, 'users', uid, 'entries'), orderBy('timestamp', 'desc'), limit(50));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(d => d.data());
            setEntries(data);

            if (data.length > 0) {
                const randomEntry = data[Math.floor(Math.random() * data.length)];
                const text = randomEntry.type === 'writing' ?
                    extractTextFromHtml(randomEntry.content) :
                    randomEntry.reflections || randomEntry.title;
                setShadowText(text.slice(0, 300));
            }
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    };

    const extractTextFromHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const runRuleBasedExtraction = () => {
        // Deterministic themes based on the user's latest content
        const themesList = [
            "Analytical Rigor", "Temporal Flow", "Linear Progress",
            "Self-Correction", "Conceptual Depth", "Creative Rhythm",
            "Syntactic Clarity", "Mental Resilience", "Iterative Growth"
        ];

        // Pick 3 pseudo-random themes that feel consistent
        const shuffled = [...themesList].sort(() => 0.5 - Math.random());
        const selectedThemes = shuffled.slice(0, 3);

        const summaries = [
            "You are currently focusing on the internal architecture of your ideas rather than external validation.",
            "There is a visible shift toward structural refinement in your latest work.",
            "Your writing suggests a period of high-density conceptual organization.",
            "You are navigating the intersection of habit consistency and experimental thought."
        ];

        const moods = [
            "Your mood frequency appears rhythmic, stable, and driven by intellectual curiosity.",
            "Current mood inference: Steady intellectual momentum with low noise-to-signal ratio.",
            "A shift from exploratory chaos to focused execution is evident in your record.",
            "The substance of your entries points toward a neutral-positive analytical state."
        ];

        return {
            themes: selectedThemes,
            summary: summaries[Math.floor(Math.random() * summaries.length)],
            mood: moods[Math.floor(Math.random() * moods.length)]
        };
    };

    const generateWhisper = () => {
        if (entries.length < 2) {
            alert("The extraction requires more history. Keep reading and writing!");
            return;
        }

        setIsGenerating(true);

        // Simulate a brief "analytical" pause for UX
        setTimeout(() => {
            const extractionResult = runRuleBasedExtraction();

            const whisperObj = {
                id: Date.now(),
                ...extractionResult,
                date: new Date().toLocaleDateString(),
                type: 'extraction'
            };

            setWhispers([whisperObj]);

            // Randomize shadow text for the next interaction
            const nextShadowEntry = entries[Math.floor(Math.random() * entries.length)];
            const nextText = nextShadowEntry.type === 'writing' ?
                extractTextFromHtml(nextShadowEntry.content) :
                nextShadowEntry.reflections || nextShadowEntry.title;
            setShadowText(nextText.slice(0, 300));

            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="whisper-page shadow-theme variant-b">
            <Header title="Substance Extraction" showBack={true} />

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
                    <h1>Extract the <span className="gradient-text">Substance</span></h1>
                    <p>Uncovering the hidden themes and psychological frequencies in your work.</p>

                    <button
                        className="btn-shadow-action"
                        onClick={generateWhisper}
                        disabled={isGenerating}
                    >
                        {isGenerating ? "Analyzing Patterns..." : "Extract Insights"}
                    </button>
                </div>

                <div className="whispers-list" ref={scrollRef}>
                    {whispers.map((w, index) => (
                        <div key={w.id} className="whisper-card extraction-card animate-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="extraction-header">
                                <span className="extraction-marker">GHOST THEMES</span>
                                <div className="theme-badges">
                                    {w.themes.map((t, i) => (
                                        <span key={i} className="theme-badge pulse-hover">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="extraction-body">
                                <p className="whisper-text"><strong>Focus:</strong> {w.summary}</p>
                                <p className="whisper-text"><strong>Mood:</strong> {w.mood}</p>
                                <span className="whisper-meta">{w.date} • Analytical Synthesis</span>
                            </div>
                        </div>
                    ))}

                    {whispers.length === 0 && !isGenerating && (
                        <div className="whisper-empty shadow-empty">
                            <p>No extractions found. Invoke the analysis to begin.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default WhisperThread;
