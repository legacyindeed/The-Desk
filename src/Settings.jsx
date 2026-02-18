import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import BurgerMenu from './BurgerMenu';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

const Settings = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        name: 'User',
        email: 'user@example.com',
        theme: 'light',
        notifications: true,
        fontSize: 'medium',
        autoZen: false
    });

    useEffect(() => {
        const fetchSettings = async () => {
            if (auth.currentUser) {
                // Populate initial state from auth profile
                setSettings(prev => ({
                    ...prev,
                    name: auth.currentUser.displayName || 'User',
                    email: auth.currentUser.email || 'user@example.com'
                }));

                try {
                    const docRef = doc(db, 'users', auth.currentUser.uid, 'settings', 'preferences');
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setSettings(prev => ({ ...prev, ...docSnap.data() }));
                    }
                } catch (e) {
                    console.error("Error fetching settings:", e);
                }
            }
        };

        const timer = setTimeout(fetchSettings, 500); // Small delay to ensuring auth loads
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setSettings(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSave = async () => {
        if (!auth.currentUser) {
            alert('You must be logged in to save settings.');
            return;
        }

        try {
            await setDoc(doc(db, 'users', auth.currentUser.uid, 'settings', 'preferences'), settings);
            // Also update local storage for fallback
            localStorage.setItem('thedesk_settings', JSON.stringify(settings));
            alert('Settings saved successfully!');
        } catch (e) {
            console.error("Error saving settings:", e);
            alert("Failed to save settings.");
        }
    };

    return (
        <div className="settings-page">

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ justifySelf: 'start' }}>
                        <button
                            onClick={() => navigate(-1)}
                            className="btn-back-fancy"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                color: '#0f172a', // Darker for legibility
                                background: 'none',
                                border: 'none',
                                fontSize: '1.1rem', // Larger
                                fontWeight: 700,    // Bolder
                                cursor: 'pointer',
                                gap: '0.5rem'
                            }}
                        >
                            ← Back
                        </button>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, margin: 0, color: '#020617', justifySelf: 'center' }}>Settings</h2>
                    <div style={{ justifySelf: 'end' }}><BurgerMenu /></div>
                </div>
            </div>

            <main className="container settings-main animate-up">
                <div className="glass settings-card">
                    <section className="settings-section">
                        <h3>Profile</h3>
                        <div className="form-group">
                            <label>Display Name</label>
                            <input
                                type="text"
                                name="name"
                                value={settings.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={settings.email}
                                onChange={handleChange}
                                placeholder="email@example.com"
                            />
                        </div>
                    </section>

                    <section className="settings-section">
                        <h3>Appearance</h3>
                        <div className="form-group">
                            <label>Theme</label>
                            <select name="theme" value={settings.theme} onChange={handleChange}>
                                <option value="light">Light Sanctuary</option>
                                <option value="dark">Midnight Mode</option>
                                <option value="system">System Default</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Editor Font Size</label>
                            <select name="fontSize" value={settings.fontSize} onChange={handleChange}>
                                <option value="small">Focused (Small)</option>
                                <option value="medium">Balanced (Medium)</option>
                                <option value="large">Readable (Large)</option>
                            </select>
                        </div>
                    </section>

                    <section className="settings-section">
                        <h3>Writing Preferences</h3>
                        <div className="form-group checkbox-group">
                            <input
                                type="checkbox"
                                id="autoZen"
                                name="autoZen"
                                checked={settings.autoZen}
                                onChange={handleChange}
                            />
                            <label htmlFor="autoZen">Auto-activate Zen Mode on start</label>
                        </div>
                    </section>

                    <section className="settings-section">
                        <h3>App Notifications</h3>
                        <div className="form-group checkbox-group">
                            <input
                                type="checkbox"
                                id="notifications"
                                name="notifications"
                                checked={settings.notifications}
                                onChange={handleChange}
                            />
                            <label htmlFor="notifications">Enable daily habit reminders</label>
                        </div>
                    </section>

                    <section className="settings-section danger-zone">
                        <h3 className="danger-text">Danger Zone</h3>
                        <p className="danger-desc">This action cannot be undone. It will erase all your journal entries and settings.</p>
                        <button className="btn-danger-files" onClick={async () => {
                            if (!auth.currentUser) return;
                            if (window.confirm('Are you absolutely sure you want to delete all data? This cannot be undone.')) {
                                try {
                                    // Delete all entries
                                    const entriesRef = collection(db, 'users', auth.currentUser.uid, 'entries');
                                    const snapshot = await getDocs(entriesRef);
                                    const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'users', auth.currentUser.uid, 'entries', d.id)));
                                    await Promise.all(deletePromises);

                                    // Delete settings
                                    await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'settings', 'preferences'));

                                    localStorage.clear();
                                    alert('All data has been wiped from the cloud and this device.');
                                    navigate('/');
                                    window.location.reload();
                                } catch (e) {
                                    console.error("Error wiping data:", e);
                                    alert("Partial error wiping data. Please try again.");
                                }
                            }
                        }}>Factory Reset & Clear All Data</button>
                    </section>

                    <div className="settings-footer">
                        <button className="btn-main-premium-lg" onClick={handleSave}>Save Changes</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
