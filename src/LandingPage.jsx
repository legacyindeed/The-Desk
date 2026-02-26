import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="landing-container-split">
            {/* Left Panel */}
            <section className="panel-left">
                <div className="aurora"></div>
                <div className="noise"></div>
                <h1 className="brand-title">The Desk</h1>
            </section>

            {/* Spine */}
            <div className="spine">
                <div className="spine-marker"></div>
                <span className="spine-text">Intellectual Sanctum</span>
                <span className="spine-text">Est. 2026</span>
                <div className="spine-marker"></div>
            </div>

            {/* Right Panel */}
            <section className="panel-right">
                <nav className="nav">
                    <span onClick={() => navigate('/login')} className="nav-link" style={{ cursor: 'pointer' }}>Log In</span>
                    <span onClick={() => navigate('/signup')} className="btn-nav-primary" style={{ cursor: 'pointer' }}>Sign Up</span>
                </nav>
                <div className={`content-wrapper ${isVisible ? 'fade-in' : ''}`}>
                    <h2 className="tagline">Where Your Words Become <br />Insight</h2>
                    <p className="hero-description">
                        The Desk doesn’t just track what you read and write.<br />
                        It studies it.<br /><br />
                        Every week and month, you receive an intelligent brief on your thinking; recurring themes, shifts in perspective, unfinished intentions, and personal evolution.<br /><br />
                        You don’t just journal.<br />
                        You watch yourself grow.
                    </p>

                    <div className="features-grid">
                        <div className="feature-card card-pinky" onClick={() => navigate('/signup')}>
                            <div className="feature-icon">📓</div>
                            <div className="feature-title">
                                <span className="feature-number">I</span>
                                Capture Everything
                            </div>
                            <div className="feature-desc">
                                Log readings and writing sessions in one focused workspace.<br />
                                Build a structured archive of your intellectual life.
                                <ul className="feature-ul">
                                    <li>Track books & sessions</li>
                                    <li>Store long-form writing</li>
                                    <li>Reflection-first design</li>
                                </ul>
                            </div>
                        </div>

                        <div className="feature-card card-white" onClick={() => navigate('/signup')}>
                            <div className="feature-icon">🧠</div>
                            <div className="feature-title">
                                <span className="feature-number">II</span>
                                Pattern Recognition
                            </div>
                            <div className="feature-desc">
                                Weekly and monthly briefs detect themes in your thinking, highlight recurring ideas, and surface unfinished intentions.
                                <ul className="feature-ul">
                                    <li>Auto-generated insight summaries</li>
                                    <li>Theme & topic clustering</li>
                                    <li>“You said this 2 weeks ago” recall</li>
                                    <li>Commitment tracking</li>
                                </ul>
                            </div>
                        </div>

                        <div className="feature-card card-blue" onClick={() => navigate('/signup')}>
                            <div className="feature-icon">📈</div>
                            <div className="feature-title">
                                <span className="feature-number">III</span>
                                Evolution Mapping
                            </div>
                            <div className="feature-desc">
                                Ask The Desk how you’re changing — and get a reflective write-up based on your writing history.
                                <ul className="feature-ul">
                                    <li>Growth trajectory reports</li>
                                    <li>Shifts in tone & mindset</li>
                                    <li>Intellectual progression analysis</li>
                                    <li>On-demand self-evaluation</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
