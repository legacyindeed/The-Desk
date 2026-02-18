import React from 'react';
import './Selection.css';
import { useNavigate } from 'react-router-dom';

const Selection = () => {
    const navigate = useNavigate();

    return (
        <div className="selection-page">
            <nav className="sanctuary-nav">
                <div className="container nav-content-wrapper">
                    <div className="nav-left">
                        <button className="btn-back-fancy" onClick={() => navigate('/dashboard')}>
                            <span>←</span> Back
                        </button>
                    </div>
                    <div className="nav-right">
                        <span className="sanctuary-brand">The Desk</span>
                    </div>
                </div>
            </nav>

            <div className="selection-content container">
                <h1 className="selection-title">Select Your Session</h1>

                <div className="selection-grid">
                    <div className="select-card glass-blur" onClick={() => navigate('/track/read')}>
                        <span className="card-icon">📖</span>
                        <h2>Reading</h2>
                        <p>Immerse yourself in literature and log your intellectual growth.</p>
                    </div>

                    <div className="select-card glass-blur" onClick={() => navigate('/track/write')}>
                        <span className="card-icon">✒️</span>
                        <h2>Writing</h2>
                        <p>Articulate your thoughts and curate your daily reflections.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Selection;
