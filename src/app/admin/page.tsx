"use client";

import { useState } from 'react';
import { useRequests, PORequest } from '@/hooks/useRequests';
import { LayoutDashboard, Trash2, RefreshCcw, CheckCircle, Clock, Package, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WarehouseModal } from '@/components/WarehouseModal';
import { LiveStopwatch } from '@/components/RequestCard';

export default function AdminView() {
    const { activeRequests, completedRequests, loading, resetSystem, completeRequest, batchCompleteRequests, serverOffset } = useRequests();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [modalRequest, setModalRequest] = useState<PORequest | null>(null);

    if (loading) return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-primary)'
        }}>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading Master Console...</p>
        </div>
    );

    const toggleSelection = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleBatchComplete = async () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Mark ${selectedIds.length} requests as complete?`)) {
            await batchCompleteRequests(selectedIds);
            setSelectedIds([]);
        }
    };

    const formatDuration = (seconds?: number) => {
        if (seconds === undefined || seconds === null) return '--:--';
        const safeSeconds = Math.max(0, seconds);
        const mins = Math.floor(safeSeconds / 60);
        const secs = safeSeconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
            padding: '1.5rem',
            backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.05) 0%, transparent 40%)'
        }}>
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2.5rem',
                backgroundColor: 'var(--bg-secondary)',
                padding: '1rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <LayoutDashboard size={24} color="var(--accent-violet)" />
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>MASTER VIEW</h1>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <AnimatePresence>
                        {selectedIds.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={handleBatchComplete}
                                className="btn btn-primary"
                                style={{
                                    backgroundColor: 'var(--accent-blue)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <CheckCircle size={14} /> COMPLETE {selectedIds.length}
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={resetSystem}
                        className="btn btn-outline"
                        style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)', padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                    >
                        <RefreshCcw size={14} /> RESET
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Active Requests Summary */}
                <section>
                    <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={16} color="var(--accent-yellow)" />
                        ACTIVE RMW QUEUE ({activeRequests.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {activeRequests.length === 0 ? (
                            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                                No active requests.
                            </p>
                        ) : (
                            activeRequests.map(req => (
                                <motion.div
                                    key={req.id}
                                    className={`card ${selectedIds.includes(req.id) ? 'selected' : ''}`}
                                    style={{
                                        padding: '1rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: selectedIds.includes(req.id) ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                                        backgroundColor: selectedIds.includes(req.id) ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-secondary)',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setModalRequest(req)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div
                                            onClick={(e) => toggleSelection(req.id, e)}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '4px',
                                                border: `2px solid ${selectedIds.includes(req.id) ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                                                backgroundColor: selectedIds.includes(req.id) ? 'var(--accent-blue)' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {selectedIds.includes(req.id) && <CheckCircle size={12} color="white" />}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 800, fontSize: '1rem' }}>LINE {req.line_id}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PO: {req.po_numbers}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ marginBottom: '0.25rem' }}>
                                                <LiveStopwatch
                                                    startTime={req.created_at}
                                                    isRunning={true}
                                                    serverOffset={serverOffset}
                                                />
                                            </div>
                                            {req.status === 'pending' ? (
                                                <span className="badge pending">Pending</span>
                                            ) : (
                                                <span className="badge in_progress">Processing</span>
                                            )}
                                        </div>
                                        <Info size={16} color="var(--text-secondary)" />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* Closed Downtime Log */}
                <section>
                    <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={16} color="var(--accent-green)" />
                        CLOSED DOWNTIME LOG
                    </h2>
                    <div className="card" style={{ overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                        <th style={{ padding: '1rem', fontWeight: 700 }}>LINE</th>
                                        <th style={{ padding: '1rem', fontWeight: 700 }}>REQUIRED</th>
                                        <th style={{ padding: '1rem', fontWeight: 700 }}>FINISHED</th>
                                        <th style={{ padding: '1rem', fontWeight: 700 }}>TOTAL TIME</th>
                                        <th style={{ padding: '1rem', fontWeight: 700 }}>PO NUMBERS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {completedRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No historical logs available.</td>
                                        </tr>
                                    ) : (
                                        completedRequests.map(req => (
                                            <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                                                <td style={{ padding: '1rem', fontWeight: 700 }}>{req.line_id}</td>
                                                <td style={{ padding: '1rem', color: 'var(--accent-yellow)' }}>{req.required_time}</td>
                                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(req.completed_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--accent-green)' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <Clock size={14} />
                                                        {formatDuration(req.duration_seconds)}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{req.po_numbers}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            <WarehouseModal
                request={modalRequest}
                isOpen={!!modalRequest}
                onClose={() => setModalRequest(null)}
                onComplete={completeRequest}
                serverOffset={serverOffset}
            />

            <footer style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.4 }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em' }}>RMW MASTER CONSOLE</p>
            </footer>
        </div>
    );
}
