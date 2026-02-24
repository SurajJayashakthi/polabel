"use client";

import { useState } from 'react';
import { useRequests, PORequest } from '@/hooks/useRequests';
import { WarehouseCard } from '@/components/WarehouseCard';
import { WarehouseModal } from '@/components/WarehouseModal';
import { Warehouse, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WarehouseView() {
    const { activeRequests, loading, completeRequest, batchCompleteRequests, serverOffset } = useRequests();
    const [selectedRequest, setSelectedRequest] = useState<PORequest | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    if (loading) return (
        <div style={{
            backgroundColor: 'var(--bg-primary)',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
        }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
                <Warehouse size={40} color="var(--accent-blue)" />
            </motion.div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Syncing RMW Queue...</p>
        </div>
    );

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleBatchComplete = async () => {
        if (selectedIds.length === 0) return;
        await batchCompleteRequests(selectedIds);
        setSelectedIds([]);
    };

    const pendingCount = activeRequests.filter(r => r.status === 'pending').length;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
            padding: '2.5rem',
            backgroundImage: 'linear-gradient(180deg, rgba(59, 130, 246, 0.03) 0%, transparent 100%)'
        }}>
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4rem',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
                        <Warehouse size={36} color="var(--accent-violet)" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>RMW VIEW</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', fontWeight: 500 }}>Live Fulfillment Monitor</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <AnimatePresence>
                        {selectedIds.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onClick={handleBatchComplete}
                                className="btn btn-primary"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    backgroundColor: 'var(--accent-blue)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 800,
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                                }}
                            >
                                <CheckCircle size={20} />
                                COMPLETE {selectedIds.length} SELECTED
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>System Status</p>
                            <p style={{ fontWeight: 800, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-green)', borderRadius: '50%' }} />
                                RMW LIVE
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>Queue Active</p>
                            <p style={{ fontWeight: 900, fontSize: '1.5rem' }}>
                                {activeRequests.length} <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TASKS</span>
                            </p>
                        </div>
                        {pendingCount > 0 && (
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    padding: '0.875rem 1.5rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '2px solid var(--accent-red)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)'
                                }}
                            >
                                <AlertCircle size={22} color="var(--accent-red)" strokeWidth={3} />
                                <span style={{ color: 'var(--accent-red)', fontWeight: 900, fontSize: '1.25rem' }}>{pendingCount} URGENT</span>
                            </motion.div>
                        )}
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '2.5rem' }}>
                <AnimatePresence mode="popLayout">
                    {activeRequests.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                gridColumn: '1 / -1',
                                padding: '10rem 2rem',
                                textAlign: 'center',
                                background: 'rgba(255,255,255,0.02)',
                                border: '2px dashed var(--border-color)',
                                borderRadius: 'var(--radius-lg)'
                            }}
                        >
                            <Clock size={80} color="var(--border-color)" style={{ marginBottom: '2rem', opacity: 0.3 }} />
                            <h2 style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '1.5rem' }}>RMW Queue is Clear.</h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', opacity: 0.6 }}>Operational status: Ready for incoming requests.</p>
                        </motion.div>
                    ) : (
                        activeRequests.map((req) => (
                            <WarehouseCard
                                key={req.id}
                                request={req}
                                onClick={(request) => setSelectedRequest(request)}
                                isSelected={selectedIds.includes(req.id)}
                                onSelect={toggleSelection}
                                serverOffset={serverOffset}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>

            <WarehouseModal
                request={selectedRequest}
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onComplete={completeRequest}
                serverOffset={serverOffset}
            />
        </div>
    );
}
