import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { PORequest } from '@/hooks/useRequests';
import { LiveStopwatch } from './RequestCard';

interface WarehouseModalProps {
    request: PORequest | null;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (id: string, completedPos: string[]) => Promise<void>;
    serverOffset?: number;
}

export function WarehouseModal({ request, isOpen, onClose, onComplete, serverOffset = 0 }: WarehouseModalProps) {
    const [selectedPos, setSelectedPos] = useState<string[]>([]);

    useEffect(() => {
        if (request) {
            const pos = request.po_numbers.split(/[\s,]+/).filter(Boolean);
            setSelectedPos(pos); // Default select all
        }
    }, [request, isOpen]);

    if (!request) return null;

    const poList = request.po_numbers.split(/[\s,]+/).filter(Boolean);
    const createdDate = new Date(request.created_at);

    const togglePo = (po: string) => {
        setSelectedPos(prev =>
            prev.includes(po) ? prev.filter(p => p !== po) : [...prev, po]
        );
    };

    const handleConfirm = async () => {
        if (selectedPos.length === 0) return;
        await onComplete(request.id, selectedPos);
        onClose();
    };

    const remainingPos = poList.filter(po => !selectedPos.includes(po));
    const isPartial = selectedPos.length > 0 && selectedPos.length < poList.length;

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
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', letterSpacing: '0.1em' }}>ELAPSED DOWNTIME</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                                        <LiveStopwatch
                                            startTime={request.created_at}
                                            isRunning={true}
                                            serverOffset={serverOffset}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* PO List Selection */}
                            <div style={{ marginBottom: isPartial ? '1.5rem' : '2.5rem' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '1rem' }}>SELECT PO NUMBERS TO COMPLETE</p>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    backgroundColor: 'rgba(255,255,255,0.01)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    maxHeight: '160px',
                                    overflowY: 'auto'
                                }}>
                                    {poList.map((po, index) => {
                                        const isSelected = selectedPos.includes(po);
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => togglePo(po)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: '1rem',
                                                    padding: '0.6rem 0.8rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                                                    border: `1px solid ${isSelected ? 'rgba(59, 130, 246, 0.3)' : 'transparent'}`,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                <span style={{ fontSize: '1rem', fontWeight: 700, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{po}</span>
                                                <div style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '4px',
                                                    border: `2px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                                                    backgroundColor: isSelected ? 'var(--accent-blue)' : 'transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {isSelected && <CheckCircle size={14} color="white" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Confirmation Summary (Partial) */}
                            {isPartial && (
                                <div style={{
                                    marginBottom: '2.5rem',
                                    padding: '1.25rem',
                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-green)', letterSpacing: '0.05em' }}>COMPLETING NOW</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {selectedPos.map(po => (
                                                <span key={po} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>{po}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-yellow)', letterSpacing: '0.05em' }}>REMAINING IN QUEUE</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {remainingPos.map(po => (
                                                <span key={po} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderRadius: '4px', border: '1px solid rgba(234, 179, 8, 0.2)' }}>{po}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirm}
                                disabled={selectedPos.length === 0}
                                style={{
                                    width: '100%',
                                    padding: '1.5rem',
                                    backgroundColor: selectedPos.length === 0 ? 'var(--border-color)' : 'var(--accent-green)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    fontWeight: 900,
                                    fontSize: '1.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    boxShadow: selectedPos.length === 0 ? 'none' : '0 15px 30px -5px rgba(34, 197, 94, 0.4)',
                                    border: 'none',
                                    cursor: selectedPos.length === 0 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <CheckCircle size={28} />
                                {selectedPos.length === poList.length
                                    ? 'CONFIRM & COMPLETE FULL'
                                    : `COMPLETE ${selectedPos.length} PO(s)`}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
