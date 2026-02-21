"use client";

import { useEffect, useState } from 'react';
import { PORequest } from '@/hooks/useRequests';
import { Clock, Play, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function formatDuration(ms: number) {
    if (ms < 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .join(":");
}

export function LiveStopwatch({ startTime, isRunning }: { startTime: string, isRunning: boolean }) {
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!isRunning) return;

        const startObj = new Date(startTime).getTime();

        // Initial calculate to prevent flash
        setDuration(Date.now() - startObj);

        const interval = setInterval(() => {
            setDuration(Date.now() - startObj);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, isRunning]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 600 }}>
            <Clock size={16} />
            {formatDuration(duration)}
        </div>
    );
}

export function RequestCard({
    request,
    onUpdateStatus
}: {
    request: PORequest;
    onUpdateStatus: (id: string, status: PORequest['status']) => void;
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: `4px solid ${request.status === 'pending' ? 'var(--accent-red)' : 'var(--accent-yellow)'}` }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Line {request.line_id}</h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>PO: {request.po_numbers}</p>
                </div>
                <div className={`badge ${request.status}`}>
                    {request.status.replace('_', ' ')}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Required By</p>
                    <p style={{ fontWeight: 500 }}>{request.required_time}</p>
                </div>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Downtime</p>
                    <LiveStopwatch startTime={request.created_at} isRunning={request.status !== 'completed'} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                {request.status === 'pending' && (
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', backgroundColor: 'var(--accent-yellow)' }}
                        onClick={() => onUpdateStatus(request.id, 'in_progress')}
                    >
                        <Play size={16} /> START WORK
                    </button>
                )}
                {request.status === 'in_progress' && (
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', backgroundColor: 'var(--accent-green)' }}
                        onClick={() => onUpdateStatus(request.id, 'completed')}
                    >
                        <CheckCircle size={16} /> MARK COMPLETE
                    </button>
                )}
            </div>
        </motion.div>
    );
}
