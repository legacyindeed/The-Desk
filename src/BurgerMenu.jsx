import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BurgerMenu.css';

const BurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="burger-menu-container">
            <button className={`burger-icon ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            {isOpen && (
                <>
                    <div className="burger-overlay" onClick={() => setIsOpen(false)}></div>
                    <div className="burger-dropdown glass animate-down">
                        <button onClick={() => { navigate('/home'); setIsOpen(false); }}>Home</button>
                        <button onClick={() => { navigate('/whisper'); setIsOpen(false); }}>Whisper Thread</button>
                        <button onClick={() => { navigate('/analytics'); setIsOpen(false); }}>History</button>
                        <button onClick={() => { navigate('/dashboard'); setIsOpen(false); }}>Dashboard</button>
                        <button onClick={() => { navigate('/profile'); setIsOpen(false); }}>Profile</button>
                        <button onClick={() => { navigate('/settings'); setIsOpen(false); }}>Settings</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BurgerMenu;
