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

    // Initialize Gemini (API Key from .env)
    const genAI = import.meta.env.VITE_GEMINI_API_KEY ? new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY) : null;

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
            alert("The Shadow needs more history. Keep reading and writing!");
            return;
        }

        setIsGenerating(true);

        try {
            let finalDialogue = "";

            if (genAI) {
                // ACTUAL AI LOGIC
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                // Prepare clean data for AI
                const cleanEntries = entries.slice(0, 15).map(e => ({
                    type: e.type,
                    title: e.title,
                    content: e.type === 'writing' ? extractTextFromHtml(e.content).slice(0, 500) : e.reflections?.slice(0, 500),
                    date: e.date
                }));

                const prompt = `
                    You are a helpful intellectual assistant. 
                    Review the following most recent 7 entries from the user (reading and writing logs).
                    1. Summarize what they have been focused on in about 2 lines.
                    2. In the final line, infer what their mood was in the past vs how it seems now based on the content.
                    Keep the entire response to exactly 3 lines. Be direct, simple, and encouraging.
                    
                    User Entries: ${JSON.stringify(cleanEntries.slice(0, 7))}
                `;

                const result = await model.generateContent(prompt);
                finalDialogue = result.response.text().replace(/"/g, '');
            } else {
                // FALLBACK
                const recent = entries.slice(0, 7);
                const titles = recent.map(e => e.title).join(", ");
                finalDialogue = `Lately, I've been focused on ${titles}. I'm seeing a consistent effort in my routine. My mood seems to be stabilizing as I lean into these habits.`;
            }

            const whisperObj = {
                id: Date.now(),
                text: finalDialogue,
                date: new Date().toLocaleDateString(),
                type: 'review'
            };

            setWhispers([whisperObj, ...whispers]);

            // Randomize shadow text for next time
            const nextShadowEntry = entries[Math.floor(Math.random() * entries.length)];
            const nextText = nextShadowEntry.type === 'writing' ?
                extractTextFromHtml(nextShadowEntry.content) :
                nextShadowEntry.reflections || nextShadowEntry.title;
            setShadowText(nextText.slice(0, 300));
        } catch (error) {
            console.error("AI Generation Error:", error);
            alert("The AI is having trouble reflecting. Check your connection or API key.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="whisper-page shadow-theme">
            <Header title="The Weekly Review" showBack={true} />

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
                    <h1>Reflect on your <span className="gradient-text">Journey</span></h1>
                    <p>A 3-line summary of your recent focus and an AI inference of your mood.</p>

                    <button
                        className="btn-shadow-action"
                        onClick={generateWhisper}
                        disabled={isGenerating}
                    >
                        {isGenerating ? "Analyzing 7 Entries..." : "Generate Review"}
                    </button>
                </div>

                <div className="whispers-list" ref={scrollRef}>
                    {whispers.map((w, index) => (
                        <div key={w.id} className="whisper-card shadow-card animate-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="whisper-avatar">📖</div>
                            <div className="whisper-content">
                                <p className="whisper-text" style={{ fontStyle: 'normal', whiteSpace: 'pre-line' }}>{w.text}</p>
                                <span className="whisper-meta">{w.date} • Intellectual Review</span>
                            </div>
                        </div>
                    ))}

                    {whispers.length === 0 && !isGenerating && (
                        <div className="whisper-empty shadow-empty">
                            <p>No reviews generated. Click above to summarize your recent paths.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default WhisperThread;
