import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Header from './Header';
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

            <Header title="Dashboard" showBack={true} />

            <main className="container dashboard-container">
                <Dashboard entries={entries} />
            </main>
        </div>
    );
};

export default DashboardPage;
