import React, { useMemo, useState } from 'react';
import './HeatmapCalendar.css';

const HeatmapCalendar = ({ entries }) => {
    const [tooltip, setTooltip] = useState(null);

    const { days, monthLabels } = useMemo(() => {
        const today = new Date();
        const days = [];

        // Build 365-day window ending today
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            days.push({
                date: d,
                dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
            });
        }

        // Map entries to day keys for fast lookup
        const entryMap = {};
        entries.forEach(e => {
            if (!e.date) return;
            const parsed = new Date(e.date);
            if (isNaN(parsed)) return;
            const key = `${parsed.getFullYear()}-${parsed.getMonth()}-${parsed.getDate()}`;
            if (!entryMap[key]) entryMap[key] = { reading: 0, writing: 0 };
            if (e.type === 'reading') entryMap[key].reading++;
            if (e.type === 'writing') entryMap[key].writing++;
        });

        // Attach activity data to each day
        days.forEach(day => {
            day.activity = entryMap[day.key] || null;
        });

        // Generate month labels (position of first cell of each month in the week-columns grid)
        const monthLabels = [];
        let lastMonth = -1;
        days.forEach((day, idx) => {
            const month = day.date.getMonth();
            const col = Math.floor(idx / 7);
            if (month !== lastMonth) {
                monthLabels.push({
                    label: day.date.toLocaleDateString('en-US', { month: 'short' }),
                    col,
                });
                lastMonth = month;
            }
        });

        return { days, monthLabels };
    }, [entries]);

    // Pad the start to align the first day to the correct weekday column
    const firstDayOfWeek = days[0].date.getDay(); // 0=Sun
    const paddedDays = [
        ...Array(firstDayOfWeek).fill(null),
        ...days,
    ];

    const getColor = (activity) => {
        if (!activity) return 'empty';
        if (activity.reading > 0 && activity.writing > 0) return 'both';
        if (activity.reading > 0) return 'reading';
        return 'writing';
    };

    const getTooltipText = (day) => {
        if (!day) return '';
        if (!day.activity) return `${day.dateStr} — No activity`;
        const { reading, writing } = day.activity;
        const parts = [];
        if (reading) parts.push(`${reading} reading session${reading > 1 ? 's' : ''}`);
        if (writing) parts.push(`${writing} writing session${writing > 1 ? 's' : ''}`);
        return `${day.dateStr} — ${parts.join(' & ')}`;
    };

    // Number of columns needed
    const numCols = Math.ceil(paddedDays.length / 7);

    return (
        <div className="heatmap-wrapper">
            <div className="heatmap-header">
                <h3>Activity Calendar</h3>
                <div className="heatmap-legend">
                    <span className="legend-item"><span className="legend-dot dot-empty" />No activity</span>
                    <span className="legend-item"><span className="legend-dot dot-reading" />Reading</span>
                    <span className="legend-item"><span className="legend-dot dot-writing" />Writing</span>
                    <span className="legend-item"><span className="legend-dot dot-both" />Both</span>
                </div>
            </div>

            <div className="heatmap-scroll-container">
                {/* Month labels */}
                <div className="heatmap-month-row" style={{ gridTemplateColumns: `repeat(${numCols}, 14px)` }}>
                    {Array.from({ length: numCols }).map((_, col) => {
                        const label = monthLabels.find(m => m.col === col);
                        return (
                            <span key={col} className="month-label">
                                {label ? label.label : ''}
                            </span>
                        );
                    })}
                </div>

                {/* Day grid — rendered as columns of 7 */}
                <div className="heatmap-grid" style={{ gridTemplateColumns: `repeat(${numCols}, 14px)` }}>
                    {paddedDays.map((day, idx) => (
                        <div
                            key={idx}
                            className={`heatmap-cell ${day ? `cell-${getColor(day.activity)}` : 'cell-pad'}`}
                            onMouseEnter={(e) => {
                                if (!day) return;
                                setTooltip({ text: getTooltipText(day), x: e.clientX, y: e.clientY });
                            }}
                            onMouseLeave={() => setTooltip(null)}
                        />
                    ))}
                </div>
            </div>

            {tooltip && (
                <div
                    className="heatmap-tooltip"
                    style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
                >
                    {tooltip.text}
                </div>
            )}
        </div>
    );
};

export default HeatmapCalendar;
