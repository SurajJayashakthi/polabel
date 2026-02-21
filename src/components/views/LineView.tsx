"use client";

import React, { useState } from 'react';
import { useRequests } from '@/hooks/useRequests';
import { useAuth } from '@/context/AuthContext';
import { Edit3, LogOut, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function LineView() {
    const { requests, loading } = useRequests();
    const { signOut } = useAuth();
    const [lineId, setLineId] = useState('');
    const [poNumbers, setPoNumbers] = useState('');
    const [requiredTime, setRequiredTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // For the tablet view, we let the user filter to "their" line
    const [monitoredLine, setMonitoredLine] = useState<string | null>(null);

    const activeLineRequests = requests.filter(r =>
        r.status !== 'completed' && (!monitoredLine || r.line_id === monitoredLine)
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('requests').insert([{
                line_id: lineId,
                po_numbers: poNumbers,
                required_time: requiredTime,
                requested_by: 'Line Tablet',
                status: 'pending'
            }]);

            if (error) throw error;

            setPoNumbers('');
            setRequiredTime('');
            setMonitoredLine(lineId);
        } catch (error) {
            alert('Error submitting request');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Activating Line Tablet...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}
        >
            <header className="header" style={{ padding: '0 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Edit3 size={24} color="var(--accent-yellow)" />
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Line Input & Status</h1>
                </div>
                <button onClick={signOut} className="btn-outline">
                    <LogOut size={18} /> Exit
                </button>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem' }}>
                {/* Input Form Column */}
                <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>New Production Call</h2>
                    <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Line Number</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. 15"
                                value={lineId}
                                onChange={e => setLineId(e.target.value)}
                                style={{ fontSize: '1.1rem', padding: '0.75rem' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>PO Numbers</label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Comma separated"
                                value={poNumbers}
                                onChange={e => setPoNumbers(e.target.value)}
                                style={{ fontSize: '1.1rem', padding: '0.75rem' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Required By</label>
                            <input
                                required
                                type="time"
                                value={requiredTime}
                                onChange={e => setRequiredTime(e.target.value)}
                                style={{ fontSize: '1.1rem', padding: '0.75rem' }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                            style={{ padding: '1rem', marginTop: '0.5rem', backgroundColor: 'var(--accent-blue)', fontSize: '1.1rem' }}
                        >
                            {isSubmitting ? 'Submitting...' : 'SEND REQUEST'}
                        </button>
                    </form>
                </div>

                {/* Status Monitoring Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                            {monitoredLine ? `Line ${monitoredLine} Requests` : 'Recent Requests'}
                        </h2>
                        {monitoredLine && (
                            <button onClick={() => setMonitoredLine(null)} style={{ color: 'var(--accent-blue)', fontSize: '0.875rem' }}>
                                Show All Lines
                            </button>
                        )}
                    </div>

                    <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', width: '100px' }}>LINE</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>PO NUMBERS</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', width: '150px' }}>STATUS</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', width: '120px' }}>TIME</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {activeLineRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                No active production calls
                                            </td>
                                        </tr>
                                    ) : (
                                        activeLineRequests.map(req => (
                                            <motion.tr
                                                key={req.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                style={{ borderBottom: '1px solid var(--border-color)' }}
                                            >
                                                <td style={{ padding: '1.25rem', fontWeight: 700 }}>{req.line_id}</td>
                                                <td style={{ padding: '1.25rem' }}>{req.po_numbers}</td>
                                                <td style={{ padding: '1.25rem' }}>
                                                    <span className={`badge ${req.status}`}>{req.status}</span>
                                                </td>
                                                <td style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>{req.required_time}</td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
