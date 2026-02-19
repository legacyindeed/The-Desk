import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleMouseMove = (e) => {
            document.querySelectorAll('.feature-card').forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="landing-page-root min-h-screen flex flex-col selection:bg-[#D4AF37] selection:text-black">
            {/* Background Glow Spots */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="glow-spot" style={{ top: '-20%', left: '20%' }}></div>
                <div className="glow-spot" style={{ bottom: '-20%', right: '10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(70, 70, 90, 0.15) 0%, rgba(0,0,0,0) 70%)', animationDelay: '-4s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-container">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="nav-brand group">
                        <div className="brand-icon">
                            <div className="brand-bg"></div>
                            <svg className="w-4 h-4 relative z-10" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"></path>
                                <path d="M15 3v6h6"></path>
                            </svg>
                        </div>
                        <span className="brand-text">The Desk</span>
                    </a>

                    <div className="nav-links">
                        <span onClick={() => navigate('/login')} className="nav-link">Log In</span>
                        <button onClick={() => navigate('/signup')} className="btn-shine btn-get-started">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            <main className="landing-main">
                {/* Hero Section */}
                <div className="hero-wrapper">
                    <div className="hero-border-left"></div>
                    <div className="hero-border-right"></div>

                    <div className="reveal-up hero-badge">
                        <div className="badge-dot"></div>
                        <span className="badge-text">Intellectual Sanctum V2.0</span>
                    </div>

                    <h1 className="reveal-up delay-100 hero-title">
                        The Digital <br />
                        <span className="hero-subtitle-script text-gold-gradient">Ink & Insight</span>
                        <span className="hero-subtitle-block">Sanctuary</span>
                    </h1>

                    <div className="reveal-up delay-200 hero-separator"></div>

                    <p className="reveal-up delay-200 hero-desc">
                        A premium canvas for reflection. A distraction-free studio for your journey. <br className="hidden md:block" />
                        Elevate your habits into an art form.
                    </p>

                    <div className="reveal-up delay-300">
                        <button onClick={() => navigate('/signup')} className="btn-shine cta-button">
                            <span className="cta-content">
                                Claim Workspace
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="features-grid-wrapper reveal-up delay-300">
                    <div className="features-grid">
                        {/* Card 1: Quiet Reading */}
                        <div className="feature-card group">
                            <div>
                                <div className="icon-box">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                    </svg>
                                </div>
                                <h3 className="feature-title">Quiet Reading</h3>
                                <p className="feature-desc">
                                    Log every page with mindful reflections. Curated statistics for the discerning reader who values quality over quantity.
                                </p>
                            </div>
                            <div className="feature-actions">
                                <span className="action-text">Explore</span>
                                <div className="action-line"></div>
                            </div>
                        </div>

                        {/* Card 2: Deep Writing */}
                        <div className="feature-card group">
                            <div>
                                <div className="icon-box">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                        <path d="M2 2l7.586 7.586"></path>
                                    </svg>
                                </div>
                                <h3 className="feature-title">Deep Writing</h3>
                                <p className="feature-desc">
                                    A minimalist studio built for focus. Remove the noise of the modern web and let your words flow in a purely digital ether.
                                </p>
                            </div>
                            <div className="feature-actions">
                                <span className="action-text">Compose</span>
                                <div className="action-line"></div>
                            </div>
                        </div>

                        {/* Card 3: Pure Insight */}
                        <div className="feature-card group">
                            <div>
                                <div className="icon-box">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                        <line x1="18" y1="20" x2="18" y2="10"></line>
                                        <line x1="12" y1="20" x2="12" y2="4"></line>
                                        <line x1="6" y1="20" x2="6" y2="14"></line>
                                    </svg>
                                </div>
                                <h3 className="feature-title">Pure Insight</h3>
                                <p className="feature-desc">
                                    Visualise your intellectual progress with premium elegance. Understand your habits through a lens of clarity and style.
                                </p>
                            </div>
                            <div className="feature-actions">
                                <span className="action-text">Analyze</span>
                                <div className="action-line"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manifesto Section */}
                <div className="manifesto-section">
                    <div className="manifesto-bg-text">
                        <span className="bg-text-large">THE DESK</span>
                    </div>
                    <p className="manifesto-quote reveal-up">
                        "In an age of distraction, focus is the ultimate luxury."
                    </p>
                    <div className="manifesto-label reveal-up delay-200">
                        <div className="label-line"></div>
                        <span className="action-text tracking-widest">Manifesto</span>
                        <div className="label-line"></div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 border border-white/20 flex items-center justify-center p-1" style={{ width: '24px', height: '24px' }}>
                            <span className="font-display text-xs text-white">D</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white">The Desk © 2026</span>
                    </div>

                    <div className="footer-links">
                        <a href="#" className="footer-link">Privacy</a>
                        <a href="#" className="footer-link">Terms</a>
                        <a href="#" className="footer-link">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
