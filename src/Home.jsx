import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('thedesk_entries') || '[]');
        setEntries(data);
    }, []);

    return (
        <div className="home-sanctuary">
            {/* Darkened Background Image Overlay */}
            <div className="sanctuary-overlay"></div>

            <header className="sanctuary-nav">
                <div className="nav-left">
                    <span className="sanctuary-brand">The Desk</span>
                </div>

                <div className="nav-right">
                    <div className="auth-group">
                        <button className="auth-btn" onClick={() => navigate('/login')}>Log In</button>
                        <button className="auth-btn primary" onClick={() => navigate('/signup')}>Sign Up</button>
                    </div>
                </div>
            </header>

            <main className="sanctuary-hero animate-up">
                <div className="hero-content">
                    <h1 className="hero-title-main">The art of <br /> reading and writing.</h1>
                    <p className="hero-subtitle-main">
                        The Desk helps you turn daily reading and intentional writing into a <br />
                        consistent practice of intellectual growth.
                    </p>

                    <button className="btn-main-premium" onClick={() => navigate('/signup')}>
                        Claim Your Workspace
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;
