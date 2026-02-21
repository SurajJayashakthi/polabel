"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartProps {
    data: { name: string; cumulative_downtime: string | number }[]; // Need to parse interval to seconds
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#eab308', '#22c55e'];

export function DepartmentChart({ data }: ChartProps) {
    // Convert Postgres interval "00:00:00" or raw string to seconds for chart
    const parsedData = data.map(d => {
        let seconds = 0;
        if (typeof d.cumulative_downtime === 'string') {
            // Very basic parser for either "00:00:00" or simple strings
            const parts = d.cumulative_downtime.split(':');
            if (parts.length === 3) {
                seconds = (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]);
            } else {
                seconds = parseInt(d.cumulative_downtime, 10) || 0;
            }
        } else {
            seconds = d.cumulative_downtime || 0;
        }

        // Convert to minutes for better display
        return {
            name: d.name,
            value: Math.floor(seconds / 60)
        };
    }).filter(d => d.value > 0);

    if (parsedData.length === 0) {
        return (
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No downtime recorded yet.
            </div>
        );
    }

    return (
        <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={parsedData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {parsedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: any) => [`${value} mins`, 'Downtime']}
                        contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
