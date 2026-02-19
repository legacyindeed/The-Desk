import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="landing-page-root">
            {/* Grain Overlay */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Navigation */}
            <nav className={`luxe-nav ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : ''}`}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="luxe-logo group">
                    The Desk.
                </a>

                <div className="flex items-center gap-6 z-50">
                    <button
                        onClick={() => navigate('/login')}
                        className="menu-trigger group"
                        aria-label="Menu"
                    >
                        <div className="flex flex-col gap-1.5 group-hover:gap-0 transition-all">
                            <span className="w-5 h-[1px] bg-current block group-hover:rotate-45 group-hover:translate-y-[1px] transition-transform"></span>
                            <span className="w-5 h-[1px] bg-current block group-hover:-rotate-45 group-hover:-translate-y-[1px] transition-transform"></span>
                        </div>
                    </button>
                </div>
            </nav>

            {/* Header */}
            <header className="luxe-header">
                {/* Decorative Elements */}
                <div className="header-image-arch animate-reveal" style={{ animationDelay: '0.8s' }}>
                    <img
                        src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1887&auto=format&fit=crop"
                        alt="Sculpture"
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 transform hover:scale-110"
                    />
                </div>

                <div className="max-w-[1600px] mx-auto w-full relative z-10">
                    <div className="est-label animate-fade-in-up">
                        <div className="line-deco"></div>
                        <span className="label-text">Est. 2026 • Intellectual Sanctum</span>
                    </div>

                    <h1 className="hero-title-luxe">
                        <div className="text-reveal-wrapper">
                            <span className="block animate-reveal">The Digital</span>
                        </div>
                        <div className="text-reveal-wrapper flex items-center gap-4 flex-wrap">
                            <span className="block animate-reveal italic font-light text-luxe-accent/90" style={{ animationDelay: '0.1s', color: 'var(--accent-bold)' }}>Ink & Insight</span>

                            {/* Rotating Badge */}
                            <div className="w-[8vw] h-[8vw] rounded-full border border-black/10 items-center justify-center hidden md:flex animate-slow-spin circle-text-svg">
                                <svg className="w-full h-full p-2" viewBox="0 0 100 100">
                                    <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent"></path>
                                    <text className="text-[14px] uppercase font-bold tracking-[0.2em]" fill="currentColor">
                                        <textPath href="#circlePath" startOffset="0%">Sanctuary • Sanctuary •</textPath>
                                    </text>
                                </svg>
                            </div>
                        </div>
                        <div className="text-reveal-wrapper">
                            <span className="block animate-reveal" style={{ animationDelay: '0.2s' }}>Sanctuary</span>
                        </div>
                    </h1>

                    <div className="hero-footer animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <p className="hero-subtext">
                            A premium canvas for reflection. Eliminate the noise and elevate your daily habits into an absolute art form.
                        </p>

                        <div className="hero-actions">
                            <button onClick={() => navigate('/signup')} className="btn-fancy enter-btn">
                                Enter Sanctum
                            </button>

                            <button className="scroll-down-btn group">
                                <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Marquee */}
            <div className="marquee-wrapper">
                <div className="marquee-content animate-marquee">
                    <span className="marquee-text italic opacity-40">Focus • Clarity • Elegance</span>
                    <span className="marquee-text opacity-80">Reflection</span>
                    <span className="marquee-text italic opacity-40">Knowledge • Growth • Style</span>
                    <span className="marquee-text opacity-80">Intellect</span>
                    <span className="marquee-text italic opacity-40">Focus • Clarity • Elegance</span>
                    <span className="marquee-text opacity-80">Reflection</span>
                    <span className="marquee-text italic opacity-40">Knowledge • Growth • Style</span>
                    <span className="marquee-text opacity-80">Intellect</span>
                </div>
            </div>

            {/* Collection Section */}
            <section className="collection-section">
                <div className="collection-header">
                    <h2 className="font-display text-6xl md:text-8xl text-black">The Collection</h2>
                    <div className="mt-8 md:mt-0 text-right">
                        <span className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent-bold)' }}>Curated Tools</span>
                        <p className="text-sm opacity-60 max-w-xs ml-auto">
                            Three pillars of intellectual pursuit, designed for the modern thinker.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Item 1 */}
                    <div className="collection-item group" onClick={() => navigate('/reading-sanctuary')}>
                        <div className="item-content">
                            <div className="flex items-baseline gap-8 md:gap-16">
                                <span className="item-number">(01)</span>
                                <h3 className="item-title">Quiet Reading</h3>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0 delay-100">
                                <p className="text-sm font-light max-w-xs text-right hidden md:block">Log every page with mindful reflections. A sanctuary for literary consumption.</p>
                                <div className="item-arrow">
                                    <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {/* Hover Image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 hidden lg:block rotate-6 group-hover:rotate-0 transition-transform">
                            <img src="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover shadow-2xl" alt="Reading" />
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="collection-item group" onClick={() => navigate('/writing-studio')}>
                        <div className="item-content">
                            <div className="flex items-baseline gap-8 md:gap-16">
                                <span className="item-number">(02)</span>
                                <h3 className="item-title">Deep Writing</h3>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0 delay-100">
                                <p className="text-sm font-light max-w-xs text-right hidden md:block">A minimalist studio built for focus. Transform scattered thoughts into profound prose.</p>
                                <div className="item-arrow">
                                    <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 hidden lg:block -rotate-6 group-hover:rotate-0 transition-transform">
                            <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop" className="w-full h-full object-cover shadow-2xl" alt="Writing" />
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="collection-item group" onClick={() => navigate('/analytics')}>
                        <div className="item-content">
                            <div className="flex items-baseline gap-8 md:gap-16">
                                <span className="item-number">(03)</span>
                                <h3 className="item-title">Pure Insight</h3>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0 delay-100">
                                <p className="text-sm font-light max-w-xs text-right hidden md:block">Visualized intellectual progress. Understand your habits like never before.</p>
                                <div className="item-arrow">
                                    <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 hidden lg:block rotate-3 group-hover:rotate-0 transition-transform">
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover shadow-2xl" alt="Analytics" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="quote-section">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" className="w-full h-full object-cover" alt="Texture" />
                </div>

                <div className="quote-content">
                    <svg className="quote-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H13.8827C14.717 5 15.352 4.20822 15.1506 3.39572C15.0345 2.92705 14.6366 2.57077 14.155 2.52042C12.3969 2.33663 9.42398 2.76016 8.01698 4.01698C6.67107 5.21894 6.01698 7.37357 6.01698 10V21H14.017ZM21.017 21H16.017V23H21.017C22.1216 23 23.017 22.1046 23.017 21V15C23.017 14.269 22.6288 13.626 22.0357 13.2798C21.6704 13.0664 21.3789 12.7231 21.2181 12.3168C21.0886 11.9897 21.017 11.6315 21.017 11.2581V9.7419C21.017 8.16726 19.9678 6.84074 18.5294 6.42597C19.017 5.86013 19.5693 5 19.5693 5C19.5693 5 19.017 2.5 15.017 2.5C14.017 2.5 14.017 2.5 13.017 2.5C10.017 2.5 7.01698 3.5 5.01698 6C3.01698 8.5 3.01698 12.5 3.01698 12.5V21C3.01698 22.1046 3.91241 23 5.01698 23H13.017V21H5.01698V10C5.01698 7.5 5.51698 5.5 7.01698 4C8.51698 2.5 11.017 2 13.017 2H14.017C14.5693 2 15.017 2.44772 15.017 3V5H17.017C18.1216 5 19.017 5.89543 19.017 7V9C19.017 9.55228 19.4647 10 20.017 10H21.017V11C21.017 11.5523 20.5693 12 20.017 12H19.017C17.9124 12 17.017 12.8954 17.017 14V16C17.017 17.1046 17.9124 18 19.017 18H21.017V21Z"></path>
                    </svg>
                    <p className="quote-text">
                        "We write to taste life twice, in the moment and in <span className="italic" style={{ color: 'var(--accent-bold)' }}>retrospect</span>."
                    </p>
                    <cite className="text-xs uppercase tracking-[0.25em] opacity-50 not-italic">— Anaïs Nin</cite>
                </div>
            </section>

            <footer className="luxe-footer">
                <div className="footer-top">
                    <div className="md:col-span-5">
                        <a href="#" className="font-display text-4xl block mb-8 font-bold text-black" onClick={(e) => { e.preventDefault(); }}>The Desk.</a>
                        <p className="text-sm opacity-60 max-w-sm leading-relaxed mb-8">
                            A digital atelier for the modern intellectual. Crafted with precision in 2026.
                        </p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="opacity-50">Systems Operational</span>
                    </div>
                    <p className="opacity-40">© 2026 The Desk Inc. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
