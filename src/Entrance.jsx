import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Entrance.css';

const Entrance = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('thedesk_user') || '{}');
        setUser(userData);

        // Auto-navigate after the animation completes
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 3500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="entrance-page">
            <div className="entrance-overlay"></div>
            <div className="entrance-content">
                <div className="entrance-text-group animate-reveal">
                    <span className="entrance-brand">The Desk</span>
                    <h1 className="entrance-welcome">Welcome back, {user?.name || 'Seeker'}.</h1>
                    <div className="entrance-loader">
                        <div className="loader-bar"></div>
                    </div>
                    <p className="entrance-sub">Preparing your workspace...</p>
                </div>
            </div>
        </div>
    );
};

export default Entrance;
