import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { auth, db } from './firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import './WhisperThread.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

const WhisperThread = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [whispers, setWhispers] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [user, setUser] = useState(null);
    const [shadowText, setShadowText] = useState('');
    const scrollRef = useRef(null);

    // Initialize Gemini (Safely handle potentially undefined env var)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = (apiKey && apiKey !== 'undefined' && apiKey !== '') ? new GoogleGenerativeAI(apiKey) : null;

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

    const generateWhisper = async () => {
        if (entries.length < 2) {
            alert("The extraction requires more history. Keep reading and writing!");
            return;
        }

        setIsGenerating(true);

        try {
            let resultObj = {
                themes: ["Analyzing...", "Processing...", "Syncing..."],
                summary: "The AI is currently processing your data.",
                mood: "Stable"
            };

            if (genAI) {
                console.log("AI Status: API Key active. Trying Model...");

                let result;
                try {
                    // Standard v1 identifiers
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                    const cleanEntries = entries.slice(0, 10).map(e => ({
                        type: e.type,
                        content: e.type === 'writing' ? extractTextFromHtml(e.content).slice(0, 1500) : e.reflections?.slice(0, 1500),
                    }));

                    const prompt = `Return ONLY JSON: { "themes": ["theme1", "theme2", "theme3"], "summary": "...", "mood": "..." }. Analyze these 10 entries (ignore titles): ${JSON.stringify(cleanEntries)}`;

                    const result = await model.generateContent(prompt);
                    const responseText = result.response.text();
                    const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0] || responseText;
                    resultObj = JSON.parse(jsonStr);
                } catch (firstError) {
                    console.error("1.5-flash failed, trying 1.0-pro fallback...", firstError);
                    const proModel = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
                    const cleanEntries = entries.slice(0, 10).map(e => ({
                        type: e.type,
                        content: e.type === 'writing' ? extractTextFromHtml(e.content).slice(0, 1500) : e.reflections?.slice(0, 1500),
                    }));
                    const prompt = `Return ONLY JSON: { "themes": ["theme1", "theme2", "theme3"], "summary": "...", "mood": "..." }. Analyze these 10 entries: ${JSON.stringify(cleanEntries)}`;
                    const result = await proModel.generateContent(prompt);
                    const responseText = result.response.text();
                    const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0] || responseText;
                    resultObj = JSON.parse(jsonStr);
                }
            } else {
                resultObj = {
                    themes: ["Self-Correction", "Linear Growth", "Analytical Rigor"],
                    summary: "Focusing on refinement of existing ideas.",
                    mood: "Consistent, rhythmic drive."
                };
            }

            const whisperObj = {
                id: Date.now(),
                ...resultObj,
                date: new Date().toLocaleDateString(),
                type: 'extraction'
            };

            setWhispers([whisperObj]);

            // Randomize shadow text
            const nextShadowEntry = entries[Math.floor(Math.random() * entries.length)];
            const nextText = nextShadowEntry.type === 'writing' ?
                extractTextFromHtml(nextShadowEntry.content) :
                nextShadowEntry.reflections || nextShadowEntry.title;
            setShadowText(nextText.slice(0, 300));

        } catch (error) {
            console.error("AI Extraction Error:", error);
            alert(`Analysis failed: ${error.message || 'Connection Error'}. Please ensure your API key is active and entries contain enough text.`);
        } finally {
            setIsGenerating(false);
        }
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
                        {isGenerating ? "Analyzing Substance..." : "Extract Insights"}
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
