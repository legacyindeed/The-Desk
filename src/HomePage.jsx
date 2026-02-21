import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Assuming firebase auth is set up
import './HomePage.css';
import Header from './Header';
import BurgerMenu from './BurgerMenu';

const quotes = [
    { text: "Reading is essential for those who seek to rise above the ordinary.", author: "Jim Rohn" },
    { text: "Either write something worth reading or do something worth writing.", author: "Benjamin Franklin" },
    { text: "A reader lives a thousand lives before he dies . . . The man who never reads lives only one.", author: "George R.R. Martin" },
    { text: "You can make anything by writing.", author: "C.S. Lewis" },
    { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
    { text: "Start writing, no matter what. The water does not flow until the faucet is turned on.", author: "Louis L'Amour" },
];

const facts = [
    "Writing by hand improves memory retention and understanding.",
    "Reading fiction can increase empathy and emotional intelligence.",
    "Journaling can reduce stress and anxiety by helping you process emotions.",
    "Regular writing habits are linked to improved communication skills.",
    "Reading for just 6 minutes a day can reduce stress levels by up to 68%.",
];

const articles = [
    { title: "The Art of Deep Work", url: "https://www.calnewport.com/books/deep-work/", desc: "Mastering focus in a distracted world." },
    { title: "Atomic Habits", url: "https://jamesclear.com/atomic-habits", desc: "Tiny changes, remarkable results." },
    { title: "Why Writing Matters", url: "https://www.medium.com/", desc: "Explore diverse perspectives on the craft." },
    { title: "Benefits of Reading", url: "https://www.healthline.com/health/benefits-of-reading-books", desc: "Scientific reasons to read more." },
];

const HomePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [quote, setQuote] = useState(quotes[0]);
    const [fact, setFact] = useState(facts[0]);
    const [recommendation, setRecommendation] = useState(articles[0]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate('/'); // Redirect to landing if not logged in
            }
        });

        // Randomize content on mount
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        setFact(facts[Math.floor(Math.random() * facts.length)]);
        setRecommendation(articles[Math.floor(Math.random() * articles.length)]);

        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className="home-dashboard">
            <Header
                actions={
                    <>
                        <button className="header-pill-btn" onClick={() => navigate('/analytics')}>
                            <span>📜</span> History
                        </button>
                        <button className="header-pill-btn whisper-btn" onClick={() => navigate('/whisper')}>
                            <span>🌬️</span> Whisper
                        </button>
                        <button className="header-pill-btn" onClick={() => navigate('/dashboard')}>
                            <span>📊</span> Stats
                        </button>
                    </>
                }
            />

            <main className="home-content container">
                <section className="welcome-section animate-up">
                    <h1>Welcome back, <span className="highlight">{user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Seeker'}</span>.</h1>
                    <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </section>

                <section className="quick-actions animate-up" style={{ animationDelay: '0.1s', marginTop: '2rem', marginBottom: '3rem' }}>
                    <div className="action-buttons">
                        <button className="action-btn write" onClick={() => navigate('/track/write')}>
                            <span className="icon">✍️</span> Start Writing
                        </button>
                        <button className="action-btn read" onClick={() => navigate('/track/read')}>
                            <span className="icon">📖</span> Log Reading
                        </button>
                    </div>
                </section>

                <div className="dashboard-grid">
                    <div className="card quote-card glass-blur animate-up" style={{ animationDelay: '0.2s' }}>
                        <h3>Daily Inspiration</h3>
                        <blockquote>"{quote.text}"</blockquote>
                        <cite>— {quote.author}</cite>
                    </div>

                    <div className="card fact-card glass-blur animate-up" style={{ animationDelay: '0.3s' }}>
                        <h3>Did You Know?</h3>
                        <p>{fact}</p>
                    </div>

                    <div className="card article-card glass-blur animate-up" style={{ animationDelay: '0.4s' }}>
                        <h3>Recommended Read</h3>
                        <h4>{recommendation.title}</h4>
                        <p>{recommendation.desc}</p>
                        <a href={recommendation.url} target="_blank" rel="noopener noreferrer" className="read-more">Read Article →</a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
