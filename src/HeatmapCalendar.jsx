import React, { useMemo } from 'react';
import './HeatmapCalendar.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKS = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'];

const HeatmapCalendar = ({ entries }) => {

    // Build a 12×4 grid: grid[month][week] = { reading, writing }
    const grid = useMemo(() => {
        const year = new Date().getFullYear();

        // Initialize empty grid
        const g = Array.from({ length: 12 }, () =>
            Array.from({ length: 4 }, () => ({ reading: 0, writing: 0 }))
        );

        entries.forEach(e => {
            if (!e.date) return;
            const d = new Date(e.date);
            if (isNaN(d) || d.getFullYear() !== year) return;

            const month = d.getMonth();                       // 0–11
            const week = Math.min(Math.ceil(d.getDate() / 7) - 1, 3); // 0–3

            if (e.type === 'reading') g[month][week].reading++;
            if (e.type === 'writing') g[month][week].writing++;
        });

        return g;
    }, [entries]);

    const getColor = ({ reading, writing }) => {
        if (reading > 0 && writing > 0) return 'both';
        if (reading > 0) return 'reading';
        if (writing > 0) return 'writing';
        return 'empty';
    };

    const getTooltip = (monthIdx, weekIdx, { reading, writing }) => {
        const year = new Date().getFullYear();
        const label = `${MONTHS[monthIdx]} ${year} — Week ${weekIdx + 1}`;
        if (!reading && !writing) return `${label}: No activity`;
        const parts = [];
        if (reading) parts.push(`${reading} reading session${reading > 1 ? 's' : ''}`);
        if (writing) parts.push(`${writing} writing session${writing > 1 ? 's' : ''}`);
        return `${label}: ${parts.join(' & ')}`;
    };

    return (
        <div className="heatmap-wrapper">
            <div className="heatmap-header">
                <h3>Activity Calendar <span className="heatmap-year">{new Date().getFullYear()}</span></h3>
                <div className="heatmap-legend">
                    <span className="legend-item"><span className="legend-dot dot-empty" />No activity</span>
                    <span className="legend-item"><span className="legend-dot dot-reading" />Reading</span>
                    <span className="legend-item"><span className="legend-dot dot-writing" />Writing</span>
                    <span className="legend-item"><span className="legend-dot dot-both" />Both</span>
                </div>
            </div>

            <div className="heatmap-table-wrapper">
                {/* Month header row */}
                <div className="heatmap-month-header">
                    <div className="week-label-spacer" />
                    {MONTHS.map(m => (
                        <div key={m} className="month-col-label">{m}</div>
                    ))}
                </div>

                {/* 4 week rows */}
                {WEEKS.map((wk, wkIdx) => (
                    <div key={wk} className="heatmap-week-row">
                        <div className="week-label">{wk}</div>
                        {MONTHS.map((_, mIdx) => {
                            const cell = grid[mIdx][wkIdx];
                            const color = getColor(cell);
                            return (
                                <div
                                    key={mIdx}
                                    className={`heatmap-cell cell-${color}`}
                                    title={getTooltip(mIdx, wkIdx, cell)}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeatmapCalendar;
