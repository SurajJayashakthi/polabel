"use client";

import React, { useState } from 'react';
import { useRequests, PORequest } from '@/hooks/useRequests';
import { useAuth } from '@/context/AuthContext';
import { Monitor, LogOut, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkstationView() {
    const { activeRequests, loading, updateRequestStatus } = useRequests();
    const { signOut } = useAuth();
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    const selectedRequest = activeRequests.find(r => r.id === selectedRequestId);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Initializing Workstation...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}
        >
            <header className="header" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Monitor size={24} color="var(--accent-violet)" />
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Label Workstation</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent-green)' }} />
                        Connected Locally
                    </div>
                    <button onClick={signOut} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Queue List - Left Panel */}
                <div style={{ width: '400px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Active Queue ({activeRequests.length})</h2>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <AnimatePresence>
                            {activeRequests.map(req => (
                                <motion.div
                                    key={req.id}
                                    layout
                                    onClick={() => setSelectedRequestId(req.id)}
                                    style={{
                                        padding: '1.25rem',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: selectedRequestId === req.id ? 'var(--bg-tertiary)' : 'transparent',
                                        border: `1px solid ${selectedRequestId === req.id ? 'var(--accent-violet)' : 'var(--border-color)'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    whileHover={{ backgroundColor: selectedRequestId === req.id ? 'var(--bg-tertiary)' : 'rgba(255,255,255,0.03)' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Line {req.line_id}</span>
                                        <ChevronRight size={18} color={selectedRequestId === req.id ? 'var(--accent-violet)' : 'var(--text-secondary)'} />
                                    </div>
                                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <span className={`badge ${req.status}`} style={{ fontSize: '0.65rem' }}>{req.status}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{req.po_numbers.split(',')[0]}...</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Selected Request Details - Right Panel */}
                <div style={{ flex: 1, padding: '3rem', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
                    <AnimatePresence mode="wait">
                        {!selectedRequest ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ textAlign: 'center', alignSelf: 'center', opacity: 0.5 }}
                            >
                                <Monitor size={64} style={{ marginBottom: '1.5rem', color: 'var(--border-color)' }} />
                                <h3>Select a request to begin work</h3>
                                <p>Queue updates in real-time</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={selectedRequest.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                style={{ maxWidth: '800px', width: '100%' }}
                            >
                                <div className="card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>LINE {selectedRequest.line_id}</h1>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>PO Numbers: {selectedRequest.po_numbers}</p>
                                        </div>
                                        <div className={`badge ${selectedRequest.status}`} style={{ padding: '0.5rem 1.5rem', fontSize: '1rem' }}>
                                            {selectedRequest.status.toUpperCase()}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>REQUIRED TIME</p>
                                            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{selectedRequest.required_time}</p>
                                        </div>
                                        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>REQUESTED BY</p>
                                            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{selectedRequest.requested_by}</p>
                                        </div>
                                    </div>

                                    <div style={{ padding: '2rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>WORKFLOW ACTIONS</p>
                                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                            {selectedRequest.status === 'pending' && (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '1rem 3rem', fontSize: '1.1rem', backgroundColor: 'var(--accent-yellow)' }}
                                                    onClick={() => updateRequestStatus(selectedRequest.id, 'in_progress')}
                                                >
                                                    CONFIRM & START
                                                </button>
                                            )}
                                            {selectedRequest.status === 'in_progress' && (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '1rem 3rem', fontSize: '1.1rem', backgroundColor: 'var(--accent-green)', boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}
                                                    onClick={() => {
                                                        updateRequestStatus(selectedRequest.id, 'completed');
                                                        setSelectedRequestId(null);
                                                    }}
                                                >
                                                    <CheckCircle size={24} /> MARK AS COMPLETED
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
