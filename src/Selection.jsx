import React from 'react';
import Header from './Header';
import './Selection.css';
import { useNavigate } from 'react-router-dom';

const Selection = () => {
    const navigate = useNavigate();

    return (
        <div className="selection-page">
            <Header showBack={true} />

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
