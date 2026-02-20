import React from 'react';
import { useNavigate } from 'react-router-dom';
import BurgerMenu from './BurgerMenu';
import './Header.css';

/**
 * Standardized Header component for The Desk
 * @param {string} title - Optional title to display in the center
 * @param {boolean} showBack - Whether to show the back button
 * @param {string|number} backPath - Path to navigate back to (default -1)
 * @param {boolean} showLogo - Whether to show the logo (usually when showBack is false)
 * @param {React.ReactNode} actions - Extra buttons/actions to show on the right
 */
const Header = ({ title, showBack = false, backPath = -1, showLogo = true, actions }) => {
    const navigate = useNavigate();

    return (
        <header className="app-header">
            <div className="container header-grid">
                <div className="header-left">
                    {showBack ? (
                        <button className="btn-back-fancy header-back" onClick={() => navigate(backPath)}>
                            ← <span>Back</span>
                        </button>
                    ) : (
                        showLogo && (
                            <div className="header-brand" onClick={() => navigate('/home')}>
                                <span className="brand-icon">✎</span>
                                <span className="brand-text">The Desk</span>
                            </div>
                        )
                    )}
                </div>

                <div className="header-center">
                    {title ? (
                        <h2 className="header-title">{title}</h2>
                    ) : (
                        showBack && showLogo && (
                            <div className="header-brand mini" onClick={() => navigate('/home')}>
                                <span className="brand-icon">✎</span>
                                <span className="brand-text">The Desk</span>
                            </div>
                        )
                    )}
                </div>

                <div className="header-right">
                    {actions && <div className="header-actions">{actions}</div>}
                    <BurgerMenu />
                </div>
            </div>
        </header>
    );
};

export default Header;
