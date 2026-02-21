"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, CheckCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LineForm() {
    const [lineId, setLineId] = useState('');
    const [poNumbers, setPoNumbers] = useState('');
    const [requiredTime, setRequiredTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('requests').insert([{
                line_id: lineId,
                po_numbers: poNumbers,
                required_time: requiredTime,
                department: 'RMW',
                requested_by: 'Line Operator',
                status: 'pending'
            }]);

            if (error) throw error;

            setSuccess(true);
            setPoNumbers('');
            setRequiredTime('');

            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit request to RMW');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{
                    display: 'inline-flex',
                    padding: '1.25rem',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '1rem',
                    boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.2)'
                }}>
                    <Package size={40} color="var(--accent-blue)" />
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em' }}>RMW Request</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Submit Label PO for Warehouse fulfillment</p>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>LINE NUMBER</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. M139-B"
                        value={lineId}
                        onChange={e => setLineId(e.target.value)}
                        style={{ fontSize: '1.125rem', padding: '0.75rem 1rem' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>PO NUMBERS</label>
                    <textarea
                        required
                        rows={3}
                        placeholder="Enter PO numbers separated by space or comma..."
                        value={poNumbers}
                        onChange={e => setPoNumbers(e.target.value)}
                        style={{ fontSize: '1rem', padding: '0.75rem 1rem', resize: 'none' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>REQUIRED TIME</label>
                    <input
                        required
                        type="time"
                        value={requiredTime}
                        onChange={e => setRequiredTime(e.target.value)}
                        style={{ fontSize: '1.125rem', padding: '0.75rem 1rem' }}
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1.125rem',
                        marginTop: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)'
                    }}
                >
                    {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            >
                                <Package size={18} />
                            </motion.span>
                            Processing...
                        </span>
                    ) : (
                        <><Send size={20} /> Submit to Warehouse</>
                    )}
                </motion.button>
            </form>

            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{
                            marginTop: '2rem',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            color: 'var(--accent-green)',
                            padding: '1.25rem',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            fontWeight: 600,
                            boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.1)'
                        }}
                    >
                        <CheckCircle size={24} />
                        <span>Sent to Warehouse Successfully!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
