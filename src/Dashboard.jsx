import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import './Dashboard.css';

import { auth } from './firebase';

const Dashboard = ({ entries }) => {
    const navigate = useNavigate();
    const [timeframe, setTimeframe] = React.useState('Weekly');

    const user = auth.currentUser || JSON.parse(localStorage.getItem('thedesk_user') || '{}');
    const firstName = user.displayName ? user.displayName.split(' ')[0] : (user.name ? user.name.split(' ')[0] : 'Writer');

    // Process data for charts
    const chartData = useMemo(() => {
        // ... in a real app, this would filter by timeframe
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }).reverse();

        return last7Days.map(date => {
            const dayEntries = entries.filter(e => e.date.includes(date));
            return {
                name: date,
                reading: dayEntries.filter(e => e.type === 'reading').reduce((acc, curr) => acc + Number(curr.pages || 0), 0),
                writing: dayEntries.filter(e => e.type === 'writing').reduce((acc, curr) => acc + Number(curr.wordCount || 0), 0),
            };
        });
    }, [entries]);

    const stats = useMemo(() => {
        const readTotal = entries.filter(e => e.type === 'reading').reduce((acc, curr) => acc + Number(curr.pages || 0), 0);
        const writeTotal = entries.filter(e => e.type === 'writing').reduce((acc, curr) => acc + Number(curr.wordCount || 0), 0);
        const streak = entries.length > 0 ? 12 : 0; // Mock streak for visual
        return { readTotal, writeTotal, streak };
    }, [entries]);

    return (
        <div className="dashboard-view animate-up">
            <header className="dashboard-header">
                <div className="welcome-text">
                    <h1>Welcome back{firstName ? `, ${firstName}` : ''}.</h1>
                    <p>Your creative momentum is building.</p>
                </div>

                <div className="timeframe-selector">
                    {['Weekly', 'Monthly', 'Annual'].map(t => (
                        <button
                            key={t}
                            className={`time-btn ${timeframe === t ? 'active' : ''}`}
                            onClick={() => setTimeframe(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </header>

            <div className="stats-strip">
                <div className="stat-card">
                    <span className="label">Total Pages Read</span>
                    <span className="value">{stats.readTotal} <span className="unit">Pages</span></span>
                </div>
                <div className="stat-card">
                    <span className="label">Words Written</span>
                    <span className="value">{stats.writeTotal} <span className="unit">Words</span></span>
                </div>
                <div className="stat-card">
                    <span className="label">Current Streak</span>
                    <span className="value">{stats.streak} <span className="unit">Days</span></span>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Reading Consistency</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '12px' }}
                                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                            />
                            <Bar dataKey="reading" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <h3>Writing Velocity</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '12px' }}
                            />
                            <Line type="monotone" dataKey="writing" stroke="#020617" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="recent-activity">
                <div className="section-header">
                    <h3>Recent Activity</h3>
                    <button className="btn-secondary-fancy" onClick={() => navigate('/analytics')}>View History →</button>
                </div>
                <div className="activity-list">
                    {entries.slice(0, 3).map(entry => (
                        <div key={entry.id} className="activity-item">
                            <span className="type-icon">{entry.type === 'reading' ? '📖' : '✒️'}</span>
                            <div className="item-info">
                                <strong>{entry.title || (entry.type === 'reading' ? 'Read Session' : 'Write Session')}</strong>
                                <span>{entry.date}</span>
                            </div>
                            <div className="item-stat">
                                {entry.type === 'reading' ? `${entry.pages} pgs` : `${entry.wordCount} wds`}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
