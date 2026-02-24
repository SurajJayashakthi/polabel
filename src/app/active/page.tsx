"use client";

import { useRequests } from '@/hooks/useRequests';
import { RequestCard } from '@/components/RequestCard';
import { AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function ActiveRequests() {
    const { activeRequests, loading, updateRequestStatus, serverOffset } = useRequests();

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>Loading active requests...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Clock size={28} color="var(--accent-yellow)" />
                <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Active Requests</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                <AnimatePresence>
                    {activeRequests.length === 0 ? (
                        <div style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', gridColumn: '1 / -1' }}>
                            No active requests. Good job!
                        </div>
                    ) : (
                        activeRequests.map(req => (
                            <RequestCard
                                key={req.id}
                                request={req}
                                onUpdateStatus={updateRequestStatus}
                                serverOffset={serverOffset}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
