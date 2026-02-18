import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import BurgerMenu from './BurgerMenu';
import './Dashboard.css';
import { auth, db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        let unsubscribeSnapshot = null;

        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (user) {
                const q = query(collection(db, 'users', user.uid, 'entries'), orderBy('timestamp', 'desc'));
                unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setEntries(data);
                });
            } else {
                setEntries([]);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, []);

    return (
        <div className="app dashboard-mode">

            <nav className="sanctuary-nav container">
                <div className="nav-left" style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="sanctuary-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem', color: '#3b82f6' }}>✎</span> The Desk
                    </span>
                </div>
                <div className="nav-right">
                    <BurgerMenu />
                </div>
            </nav>

            <div className="container" style={{ marginTop: '1rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    title="Go Back"
                >
                    ← Back
                </button>
            </div>

            <main className="container dashboard-container">
                <Dashboard entries={entries} />
            </main>
        </div>
    );
};

export default DashboardPage;
