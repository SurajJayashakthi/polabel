"use client";

import { useRequests } from '@/hooks/useRequests';
import { Clock, CheckCircle } from 'lucide-react';

export default function CompletedRequests() {
    const { completedRequests, loading } = useRequests();

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>Loading records...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <CheckCircle size={28} color="var(--accent-green)" />
                <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Closed Downtime</h2>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {completedRequests.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No completed requests yet.
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Line ID</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>PO Numbers</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Requested By</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Date Initiated</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completedRequests.map(req => (
                                <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{req.line_id}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{req.po_numbers}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{req.requested_by}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                                        {new Date(req.created_at).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span className="badge completed">Completed</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
