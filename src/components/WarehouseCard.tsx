"use client";

import { useState, useEffect } from 'react';
import { PORequest } from '@/hooks/useRequests';
import { Clock, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface WarehouseCardProps {
    request: PORequest;
    onClick: (request: PORequest) => void;
}

export function WarehouseCard({ request, onClick }: WarehouseCardProps) {
    const [secondsElapsed, setSecondsElapsed] = useState(0);

    useEffect(() => {
        // Calculate initial seconds based on created_at
        const start = new Date(request.created_at).getTime();
        const update = () => {
            const now = Date.now();
            setSecondsElapsed(Math.floor((now - start) / 1000));
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [request.created_at]);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isPending = request.status === 'pending';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: 1,
                backgroundColor: isPending ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-secondary)',
                borderColor: isPending ? 'var(--accent-red)' : 'var(--border-color)'
            }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
            onClick={() => onClick(request)}
            className="card"
            style={{
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                borderWidth: isPending ? '3px' : '1px',
                cursor: 'pointer',
                boxShadow: isPending ? '0 0 20px rgba(239, 68, 68, 0.15)' : 'var(--shadow-md)'
            }}
        >
            {isPending && (
                <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        backgroundColor: 'var(--accent-red)',
                        zIndex: 2
                    }}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                        padding: '1rem',
                        backgroundColor: isPending ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {isPending ? (
                            <AlertTriangle size={32} color="var(--accent-red)" strokeWidth={3} />
                        ) : (
                            <Package size={28} color="var(--accent-blue)" />
                        )}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.025em' }}>LINE {request.line_id}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 700 }}>{request.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: secondsElapsed > 600 ? 'var(--accent-red)' : 'var(--text-primary)',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        letterSpacing: '-0.02em'
                    }}>
                        <Clock size={20} />
                        {formatTime(secondsElapsed)}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800, marginTop: '0.25rem', letterSpacing: '0.05em' }}>ELAPSED TIME</p>
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>PO NUMBERS</label>
                <div style={{
                    marginTop: '0.5rem',
                    padding: '1rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                }}>
                    <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{request.po_numbers}</p>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>REQUIRED BY</label>
                    <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-yellow)' }}>{request.required_time}</p>
                </div>

                <div style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: 'var(--accent-blue)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em'
                }}>
                    CLICK TO VIEW DETAILS
                </div>
            </div>
        </motion.div>
    );
}
