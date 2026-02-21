"use client";

import React, { useEffect, useState } from 'react';
import { useRequests } from '@/hooks/useRequests';
import { RequestCard } from '@/components/RequestCard';
import { DepartmentChart } from '@/components/DepartmentChart';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Users, LogOut, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function MasterAdminView() {
    const { requests, activeRequests, loading, updateRequestStatus } = useRequests();
    const { signOut, user } = useAuth();
    const [departments, setDepartments] = useState<any[]>([]);

    useEffect(() => {
        async function fetchDepartments() {
            const { data } = await supabase.from('departments').select('*');
            setDepartments(data || []);
        }
        fetchDepartments();
    }, [activeRequests]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this request?')) {
            const { error } = await supabase.from('requests').delete().eq('id', id);
            if (error) alert('Error deleting request');
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin Console...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mobile-container" // Will define in globals.css for specific mobile look if needed
            style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}
        >
            <header className="header" style={{ padding: '0 1rem', height: '60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LayoutDashboard size={20} color="var(--accent-blue)" />
                    <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Master Admin</h1>
                </div>
                <button onClick={signOut} style={{ color: 'var(--text-secondary)' }}>
                    <LogOut size={20} />
                </button>
            </header>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Analytics Section - Top on Mobile */}
                <section>
                    <h2 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Real-time Analytics</h2>
                    <div className="card" style={{ padding: '1rem' }}>
                        <DepartmentChart data={departments} />
                    </div>
                </section>

                {/* Requests Section */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Requests</h2>
                        <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                            {activeRequests.length}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <AnimatePresence>
                            {activeRequests.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
                                    No active requests
                                </div>
                            ) : (
                                activeRequests.map(req => (
                                    <div key={req.id} style={{ position: 'relative' }}>
                                        <RequestCard request={req} onUpdateStatus={updateRequestStatus} />
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button onClick={() => handleDelete(req.id)} style={{ color: 'var(--accent-red)', padding: '0.4rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* User Management Placeholder */}
                <section className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                    <Users size={20} color="var(--accent-violet)" />
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>User Management</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Manage workstation & line permissions</p>
                    </div>
                </section>
            </div>
        </motion.div>
    );
}
