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
        <div className="landing-container">
            {/* Dynamic Background Elements */}
            <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className={`landing-content ${isVisible ? 'fade-in' : ''}`}>
                <nav className="landing-nav">
                    <div className="landing-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <span className="logo-icon-main">✎</span>
                        <span className="logo-text-fancy">The Desk</span>
                    </div>
                    <div className="nav-secondary">
                        <span onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Log In</span>
                        <span onClick={() => navigate('/signup')} className="nav-signup-link">Get Started</span>
                    </div>
                </nav>

                <main className="hero-section-fancy">
                    <div className="hero-badge animate-float">Designing Your Intellectual Sanctum</div>

                    <h1 className="hero-title-fancy">
                        The Digital <span className="text-serif">Ink</span> & <span className="text-serif">Insight</span> Sanctuary
                    </h1>

                    <p className="hero-subtitle-fancy">
                        The Desk is more than a tracker. It's a premium canvas for your reading reflections
                        and a distraction-free studio for your writing journey.
                        Elevate your habits into an art form.
                    </p>

                    <div className="cta-group-fancy">
                        <button className="btn-main-premium" onClick={() => navigate('/signup')}>
                            Claim Your Workspace
                            <span className="btn-glow"></span>
                        </button>
                        <div className="secondary-cta-fancy" onClick={() => navigate('/login')}>
                            Already a member? Log In
                            <div className="arrow-icon">→</div>
                        </div>
                    </div>
                </main>

                <section className="aesthetic-grid">
                    <div className="grid-item glass-fancy animate-stagger-1">
                        <div className="item-icon">📖</div>
                        <h4>Quiet Reading</h4>
                        <p>Log every page with mindful reflections and curated book stats.</p>
                    </div>
                    <div className="grid-item glass-fancy animate-stagger-2">
                        <div className="item-icon">✒️</div>
                        <h4>Deep Writing</h4>
                        <div className="word-pulse"></div>
                        <p>A minimalist studio built for focus and creative momentum.</p>
                    </div>
                    <div className="grid-item glass-fancy animate-stagger-3">
                        <div className="item-icon">📊</div>
                        <h4>Pure Insight</h4>
                        <p>Your intellectual progress, visualized with premium elegance.</p>
                    </div>
                </section>
            </div>

            <footer className="landing-footer-minimal">
                <p>Curated for the intentional mind. &copy; 2026 The Desk</p>
            </footer>
        </div>
    );
};

export default LandingPage;
