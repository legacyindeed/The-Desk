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
                    <div className="landing-logo" onClick={() => navigate('/')}>
                        <div className="app-logo">
                            <span className="logo-icon">✎</span>
                            <span className="logo-text">the<span>desk</span></span>
                        </div>
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
                        <div className="card-accent reading-accent" />
                        <div className="item-icon">📖</div>
                        <h4>Quiet Reading</h4>
                        <p>Log every page with mindful reflections and curated book stats. Build a living record of your intellectual journey, one chapter at a time.</p>
                        <ul className="feature-list">
                            <li>Track pages & reading sessions</li>
                            <li>Add reflections & highlights</li>
                            <li>Build your personal library</li>
                        </ul>
                        <span className="card-cta">Start Reading →</span>
                    </div>
                    <div className="grid-item glass-fancy animate-stagger-2">
                        <div className="card-accent writing-accent" />
                        <div className="item-icon">✒️</div>
                        <h4>Deep Writing</h4>
                        <p>A distraction-free studio built for focus and creative momentum. Your words deserve a premium canvas, not a cluttered interface.</p>
                        <ul className="feature-list">
                            <li>Rich-text editor with Zen mode</li>
                            <li>Live word & character count</li>
                            <li>Image embeds via cloud storage</li>
                        </ul>
                        <span className="card-cta">Start Writing →</span>
                    </div>
                    <div className="grid-item glass-fancy animate-stagger-3">
                        <div className="card-accent insight-accent" />
                        <div className="item-icon">📊</div>
                        <h4>Pure Insight</h4>
                        <p>Your intellectual progress, visualized with premium elegance. Understand your habits at a glance and extract the substance of your thinking.</p>
                        <ul className="feature-list">
                            <li>Dashboard with live charts</li>
                            <li>Substance extraction engine</li>
                            <li>Studio & Sanctuary modes</li>
                        </ul>
                        <span className="card-cta">View Analytics →</span>
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
