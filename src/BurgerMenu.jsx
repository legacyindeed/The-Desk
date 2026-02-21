import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import './BurgerMenu.css';

const BurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

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
                        <div className="burger-divider" />
                        <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BurgerMenu;
