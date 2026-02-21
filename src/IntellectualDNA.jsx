import React, { useMemo } from 'react';
import './IntellectualDNA.css';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getPersona = (readCount, writeCount) => {
    const total = readCount + writeCount;
    if (total === 0) return { title: 'The Seeker', emoji: '🔭', desc: 'Your journey is just beginning.' };
    const readRatio = readCount / total;
    if (readRatio > 0.8) return { title: 'The Archivist', emoji: '📚', desc: 'You are a deep, devoted reader.' };
    if (readRatio > 0.6) return { title: 'The Scholar', emoji: '🎓', desc: 'Knowledge is your primary medium.' };
    if (readRatio > 0.4) return { title: 'The Polymath', emoji: '🧠', desc: 'You absorb and create in equal measure.' };
    if (readRatio > 0.2) return { title: 'The Chronicler', emoji: '✍️', desc: 'Writing is your primary art form.' };
    return { title: 'The Author', emoji: '🖊️', desc: 'A pure, relentless creator.' };
};

const IntellectualDNA = ({ entries }) => {
    const dna = useMemo(() => {
        const readEntries = entries.filter(e => e.type === 'reading');
        const writeEntries = entries.filter(e => e.type === 'writing');

        const totalPages = readEntries.reduce((a, e) => a + Number(e.pages || 0), 0);
        const totalWords = writeEntries.reduce((a, e) => a + Number(e.wordCount || 0), 0);

        const avgPages = readEntries.length > 0 ? Math.round(totalPages / readEntries.length) : 0;
        const avgWords = writeEntries.length > 0 ? Math.round(totalWords / writeEntries.length) : 0;

        // Most active day of week
        const dayCount = Array(7).fill(0);
        entries.forEach(e => {
            if (!e.date) return;
            const d = new Date(e.date);
            if (!isNaN(d)) dayCount[d.getDay()]++;
        });
        const peakDayIdx = dayCount.indexOf(Math.max(...dayCount));
        const peakDay = dayCount[peakDayIdx] > 0 ? DAYS[peakDayIdx] : 'N/A';

        // Consistency: % of last 30 days with at least one entry
        const today = new Date();
        let activeDays = 0;
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            if (entries.some(e => e.date === key)) activeDays++;
        }
        const consistency = Math.round((activeDays / 30) * 100);

        const persona = getPersona(readEntries.length, writeEntries.length);

        // Dominant session type label
        const focusSplit = readEntries.length + writeEntries.length === 0
            ? 'No data yet'
            : `${Math.round((readEntries.length / (readEntries.length + writeEntries.length)) * 100)}% Reading · ${Math.round((writeEntries.length / (readEntries.length + writeEntries.length)) * 100)}% Writing`;

        return { persona, totalPages, totalWords, avgPages, avgWords, peakDay, consistency, focusSplit };
    }, [entries]);

    return (
        <div className="dna-wrapper">
            <div className="dna-title-row">
                <div>
                    <h3>Intellectual DNA</h3>
                    <p className="dna-subtitle">Your intellectual fingerprint, distilled from your sessions.</p>
                </div>
                <div className="dna-persona glass">
                    <span className="persona-emoji">{dna.persona.emoji}</span>
                    <div>
                        <strong>{dna.persona.title}</strong>
                        <span>{dna.persona.desc}</span>
                    </div>
                </div>
            </div>

            <div className="dna-grid">
                <div className="dna-card">
                    <span className="dna-label">Focus Split</span>
                    <span className="dna-value">{dna.focusSplit}</span>
                    <div className="dna-bar-track">
                        <div
                            className="dna-bar-fill reading-fill"
                            style={{ width: dna.focusSplit === 'No data yet' ? '50%' : dna.focusSplit.split('%')[0] + '%' }}
                        />
                    </div>
                </div>

                <div className="dna-card">
                    <span className="dna-label">Avg. Pages / Session</span>
                    <span className="dna-value large">{dna.avgPages}<span className="dna-unit"> pgs</span></span>
                </div>

                <div className="dna-card">
                    <span className="dna-label">Avg. Words / Session</span>
                    <span className="dna-value large">{dna.avgWords.toLocaleString()}<span className="dna-unit"> wds</span></span>
                </div>

                <div className="dna-card">
                    <span className="dna-label">Peak Writing Day</span>
                    <span className="dna-value large">{dna.peakDay}</span>
                </div>

                <div className="dna-card">
                    <span className="dna-label">30-Day Consistency</span>
                    <span className="dna-value large">{dna.consistency}<span className="dna-unit">%</span></span>
                    <div className="dna-bar-track">
                        <div className="dna-bar-fill consistency-fill" style={{ width: `${dna.consistency}%` }} />
                    </div>
                </div>

                <div className="dna-card">
                    <span className="dna-label">Total Knowledge</span>
                    <span className="dna-value large">{dna.totalPages.toLocaleString()}<span className="dna-unit"> pages</span></span>
                    <span className="dna-value large" style={{ marginTop: '0.25rem' }}>{dna.totalWords.toLocaleString()}<span className="dna-unit"> words</span></span>
                </div>
            </div>
        </div>
    );
};

export default IntellectualDNA;
