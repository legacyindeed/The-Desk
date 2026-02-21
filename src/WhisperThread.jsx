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
            let resultObj = null;

            if (genAI) {
                console.log("AI Status: API Key active. Length:", apiKey?.length);

                let result;
                try {
                    console.log("Attempting extraction with gemini-1.5-flash...");
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                    const cleanEntries = entries.slice(0, 10).map(e => ({
                        type: e.type,
                        content: e.type === 'writing' ? extractTextFromHtml(e.content).slice(0, 1500) : e.reflections?.slice(0, 1500),
                    }));

                    const prompt = `
                        Analyze the substance of these 10 entries as a cold, analytical intellectual assistant.
                        Return ONLY a JSON object:
                        { "themes": ["theme1", "theme2", "theme3"], "summary": "...", "mood": "..." }
                        Do NOT mention entry titles.
                        
                        Entries: ${JSON.stringify(cleanEntries)}
                    `;

                    result = await model.generateContent(prompt);
                } catch (firstError) {
                    console.warn("Flash model failed, trying Pro model fallback...", firstError);
                    const proModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
                    // Re-run the same logic with proModel
                    const cleanEntries = entries.slice(0, 10).map(e => ({
                        type: e.type,
                        content: e.type === 'writing' ? extractTextFromHtml(e.content).slice(0, 1500) : e.reflections?.slice(0, 1500),
                    }));
                    const prompt = `Return JSON ONLY: { "themes": ["theme1", "theme2", "theme3"], "summary": "...", "mood": "..." }. Analyze these 10 entries: ${JSON.stringify(cleanEntries)}`;
                    result = await proModel.generateContent(prompt);
                }

                const responseText = result.response.text();
                const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0] || responseText;
                resultObj = JSON.parse(jsonStr);
                console.log("AI Extraction Success:", resultObj);
            } else {
                console.warn("No genAI instance. Fallback active.");
                resultObj = {
                    themes: ["Self-Correction", "Linear Growth", "Analytical Rigor"],
                    summary: "You are currently focusing on the refinement of existing ideas rather than exploration.",
                    mood: "Your mood has shifted from varied curiosity to a more consistent, rhythmic drive."
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
            console.error("CRITICAL AI ERROR:", error);
            alert(`Analysis failed: ${error.message || 'Error'}. 
            
            Troubleshooting:
            1. Confirm VITE_GEMINI_API_KEY is set in Vercel 'Production' environment.
            2. The Key should start with 'AIzaSy...'. Current key starts with: ${apiKey?.substring(0, 7)}...
            3. Ensure you have 'Redeployed' in Vercel after adding the key.`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="whisper-page shadow-theme variant-b">
            <Header title="Evolution Analysis v4.0" showBack={true} />

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
