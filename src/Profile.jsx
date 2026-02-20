import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Header from './Header';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('thedesk_user') || 'null'));
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeSnapshot = null;

        const unsubscribeAuth = auth.onAuthStateChanged(currentUser => {
            if (currentUser) {
                setUser(currentUser);
                // Fetch user data
                const q = query(collection(db, 'users', currentUser.uid, 'entries'), orderBy('timestamp', 'desc'));
                unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setEntries(data);
                    setLoading(false);
                });
            } else {
                // If not logged in, redirect to landing
                navigate('/');
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, [navigate]);

    const stats = useMemo(() => {
        const readTotal = entries.filter(e => e.type === 'reading').reduce((acc, curr) => acc + Number(curr.pages || 0), 0);
        const writeTotal = entries.filter(e => e.type === 'writing').reduce((acc, curr) => acc + Number(curr.wordCount || 0), 0);
        const totalEntries = entries.length;

        // Calculate mock streak or logic for it
        // Simulating streak for now based on recent activity
        const streak = totalEntries > 0 ? Math.min(totalEntries, 14) : 0;

        return { readTotal, writeTotal, totalEntries, streak };
    }, [entries]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('thedesk_user');
            localStorage.removeItem('thedesk_entries');
            navigate('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (!user) return null;

    const initials = user.displayName
        ? user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : user.email?.substring(0, 2).toUpperCase() || 'TD';

    return (
        <div className="profile-page">
            <Header title="Your Profile" showBack={true} />

            <div className="profile-container animate-up">
                <header className="profile-header">
                    <div className="profile-avatar-placeholder">
                        {initials}
                    </div>
                    <h1 className="profile-name">{user.displayName || 'Seeker'}</h1>
                    <p className="profile-email">{user.email}</p>
                    <div style={{ marginTop: '0.5rem' }}>
                        <span className="hero-badge" style={{ background: '#eef2ff', color: '#4f46e5', borderColor: '#e0e7ff' }}>Free Member</span>
                    </div>
                </header>

                <div className="account-section glass">
                    <h3 className="section-title">📊 Lifetime Achievements</h3>
                    <div className="stats-overview">
                        <div className="profile-stat-card">
                            <span className="stat-value">{stats.readTotal}</span>
                            <span className="stat-label">Pages Read</span>
                        </div>
                        <div className="profile-stat-card">
                            <span className="stat-value">{stats.writeTotal.toLocaleString()}</span>
                            <span className="stat-label">Words Written</span>
                        </div>
                        <div className="profile-stat-card">
                            <span className="stat-value">{stats.totalEntries}</span>
                            <span className="stat-label">Total Sessions</span>
                        </div>
                        <div className="profile-stat-card">
                            <span className="stat-value">{stats.streak}</span>
                            <span className="stat-label">Day Streak</span>
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="btn-primary-fancy" onClick={() => navigate('/settings')}>
                        ⚙️ Account Settings
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                        Start New Session (Log Out)
                    </button>
                </div>

                <p style={{ textAlign: 'center', marginTop: '3rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                    The Desk v1.0.2 • Built for the focused mind.
                </p>
            </div>
        </div>
    );
};

export default Profile;
