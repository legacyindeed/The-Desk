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

    const generateWhisper = async () => {
        if (entries.length < 2) {
            alert("The extraction requires more history. Keep reading and writing!");
            return;
        }

        setIsGenerating(true);

        // Access API Key directly inside the function to avoid closure/stale value issues
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const genAI = (apiKey && apiKey !== 'undefined' && apiKey !== '') ? new GoogleGenerativeAI(apiKey) : null;

        try {
            let resultObj = null;

            if (!genAI) {
                throw new Error("AI engine not initialized. Check your VITE_GEMINI_API_KEY.");
            }

            console.log("Extraction started. Key detected:", apiKey.substring(0, 6) + "...");

            // Model fallback list
            const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
            let lastError = null;

            for (const modelName of modelsToTry) {
                try {
                    console.log(`Trying model: ${modelName}`);
                    const model = genAI.getGenerativeModel({ model: modelName });

                    const cleanEntries = entries.slice(0, 10).map(e => ({
                        type: e.type,
                        content: e.type === 'writing' ? extractTextFromHtml(e.content).slice(0, 1000) : e.reflections?.slice(0, 1000),
                    }));

                    const prompt = `Return ONLY JSON: { "themes": ["theme1", "theme2", "theme3"], "summary": "...", "mood": "..." }. Analyze these 10 entries: ${JSON.stringify(cleanEntries)}`;

                    const result = await model.generateContent(prompt);
                    const responseText = result.response.text();
                    const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0] || responseText;
                    resultObj = JSON.parse(jsonStr);

                    if (resultObj) {
                        console.log(`Success with ${modelName}`);
                        break;
                    }
                } catch (err) {
                    console.warn(`${modelName} failed:`, err.message);
                    lastError = err;
                }
            }

            if (!resultObj) {
                throw lastError || new Error("All models failed to generate content.");
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
            console.error("ULTIMATE AI ERROR:", error);
            alert(`Extraction Failed: ${error.message}
            
            Current Key: ${apiKey?.substring(0, 7)}...
            If you see '404', the model name or API is likely restricted for this specific key.`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="whisper-page shadow-theme variant-b">
            <Header title="Extraction System v7.0" showBack={true} />

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
                                    {(w.themes || []).map((t, i) => (
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
