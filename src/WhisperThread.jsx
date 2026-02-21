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

    const extractKeywords = (text) => {
        const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'for', 'with', 'was', 'as', 'at', 'be', 'this', 'have', 'from', 'or', 'by', 'but', 'not', 'what', 'all', 'we', 'when', 'can', 'said', 'an', 'if', 'my', 'up', 'do', 'about', 'reflections', 'title', 'content']);
        const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
        return words.filter(word => word.length > 3 && !stopWords.has(word));
    };

    const analyzeIntelligence = (recent, past) => {
        const recentWords = recent.map(e => extractKeywords(e.type === 'writing' ? extractTextFromHtml(e.content) : (e.reflections || '') + ' ' + e.title)).flat();
        const pastWords = past.map(e => extractKeywords(e.type === 'writing' ? extractTextFromHtml(e.content) : (e.reflections || '') + ' ' + e.title)).flat();

        const recentFreq = {};
        recentWords.forEach(w => recentFreq[w] = (recentFreq[w] || 0) + 1);

        const commonWords = recentWords.filter(w => pastWords.includes(w));
        const uniqueCommon = Array.from(new Set(commonWords));

        // Find a specific bridge
        let bridgeMessage = "";
        if (uniqueCommon.length > 0) {
            const topKeyword = uniqueCommon[Math.floor(Math.random() * uniqueCommon.length)];
            bridgeMessage = `I noticed I'm still writing/reading about "${topKeyword}" in my latest work on "${recent[0].title}," just like I was in the past. It's a clear theme in my life.`;
        }

        // Compare moods if available
        const recentMoods = recent.filter(e => e.mood).map(e => e.mood);
        const pastMoods = past.filter(e => e.mood).map(e => e.mood);

        if (recentMoods.length > 0 && pastMoods.length > 0) {
            if (recentMoods[0] !== pastMoods[0]) {
                bridgeMessage = bridgeMessage || `I used to feel more "${pastMoods[0]}" when I was doing "${past[0].title}," but I seem more "${recentMoods[0]}" now. My vibe has definitely changed.`;
            }
        }

        // Analysis of consumption vs creation
        const readCount = entries.filter(e => e.type === 'reading').length;
        const writeCount = entries.filter(e => e.type === 'writing').length;

        const ratioText = (readCount > writeCount * 2 && writeCount > 0) ?
            "I've been reading a lot more than I've been writing lately. It might be time to start putting my own thoughts down on paper." :
            (writeCount > readCount * 2 && readCount > 0) ?
                "I've been writing a lot lately. I should probably take a break and read something new to get some fresh ideas." :
                "I'm doing a great job of balancing my reading and writing right now. Keep it up.";

        const genericDialogues = [
            `My recent work on "${recent[0].title}" really reminds me of when I was focused on "${past[0].title}" earlier.`,
            `I can see a connection between what I'm doing now in "${recent[0].title}" and my older entry about "${past[0].title}."`,
            `It's interesting to see how my thoughts in "${recent[0].title}" are similar to the ones I had during "${past[0].title}."`
        ];

        // Preference: Keyword Bridge > Emotional Shift > Ratio Analysis > Generic
        return bridgeMessage || ratioText || genericDialogues[Math.floor(Math.random() * genericDialogues.length)];
    };

    const generateWhisper = () => {
        if (entries.length < 2) {
            alert("The Shadow needs more of your history to find a dialogue. Keep reading and writing!");
            return;
        }

        setIsGenerating(true);

        setTimeout(() => {
            const recent = entries.slice(0, 5);
            const past = entries.slice(5, 50); // Use the rest of history

            const dialogue = analyzeIntelligence(recent, past);

            const whisperObj = {
                id: Date.now(),
                text: dialogue,
                date: new Date().toLocaleDateString(),
                type: 'shadow'
            };

            setWhispers([whisperObj, ...whispers]);
            setIsGenerating(false);

            // Randomize shadow text
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
