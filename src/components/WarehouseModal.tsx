"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { PORequest } from '@/hooks/useRequests';

interface WarehouseModalProps {
    request: PORequest | null;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (id: string) => Promise<void>;
}

export function WarehouseModal({ request, isOpen, onClose, onComplete }: WarehouseModalProps) {
    if (!request) return null;

    const poList = request.po_numbers.split(/[\s,]+/).filter(Boolean);
    const createdDate = new Date(request.created_at);

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(8px)'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            width: '100%',
                            maxWidth: '600px',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Status Bar */}
                        <div style={{
                            height: '6px',
                            backgroundColor: request.status === 'pending' ? 'var(--accent-red)' : 'var(--accent-violet)',
                            width: '100%'
                        }} />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                color: 'var(--text-secondary)',
                                zIndex: 10
                            }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ padding: '3rem' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: request.status === 'pending' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                    borderRadius: 'var(--radius-lg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {request.status === 'pending' ? (
                                        <AlertTriangle size={36} color="var(--accent-red)" />
                                    ) : (
                                        <FileText size={36} color="var(--accent-violet)" />
                                    )}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1 }}>
                                        LINE {request.line_id}
                                    </h2>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: request.status === 'pending' ? 'var(--accent-red)' : 'var(--accent-violet)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em'
                                    }}>
                                        {request.status === 'pending' ? 'URGENT DOWNTIME' : 'PROCESSING'}
                                    </span>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>SUBMITTED AT</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                                        <Clock size={18} color="var(--accent-blue)" />
                                        <span>{createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>REQUEST DATE</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                                        <Calendar size={18} color="var(--accent-blue)" />
                                        <span>{createdDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* PO List */}
                            <div style={{ marginBottom: '3.5rem' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>PO NUMBERS TO FETCH</p>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    {poList.map((po, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                border: '2px solid var(--accent-blue)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                color: 'var(--accent-blue)'
                                            }}>
                                                {index + 1}
                                            </div>
                                            <span style={{ fontSize: '1.125rem', fontWeight: 500 }}>{po}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    onComplete(request.id);
                                    onClose();
                                }}
                                style={{
                                    width: '100%',
                                    padding: '1.5rem',
                                    backgroundColor: 'var(--accent-green)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    fontWeight: 900,
                                    fontSize: '1.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    boxShadow: '0 15px 30px -5px rgba(34, 197, 94, 0.4)',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <CheckCircle size={28} />
                                CONFIRM & COMPLETE
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
