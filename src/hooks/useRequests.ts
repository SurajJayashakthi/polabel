import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type RequestStatus = 'pending' | 'in_progress' | 'completed';

export interface PORequest {
    id: string;
    line_id: string;
    po_numbers: string;
    required_time: string;
    status: 'pending' | 'in_progress' | 'completed';
    requested_by: string;
    department: string;
    created_at: string;
    completed_at?: string;
    duration_seconds?: number;
}

export function useRequests() {
    const [requests, setRequests] = useState<PORequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();

        const subscription = supabase
            .channel('requests-all')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setRequests((prev) => [payload.new as PORequest, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setRequests((prev) =>
                        prev.map(req => req.id === payload.new.id ? payload.new as PORequest : req)
                    );
                } else if (payload.eventType === 'DELETE') {
                    setRequests((prev) => prev.filter(req => req.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    async function fetchRequests() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    }

    const updateRequestStatus = async (id: string, status: RequestStatus) => {
        const { error } = await supabase
            .from('requests')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Error updating status:', error);
        }
    };

    const completeRequest = async (id: string) => {
        const request = requests.find(r => r.id === id);
        if (!request) return;

        const completedAt = new Date().toISOString();
        const durationSeconds = Math.floor((new Date(completedAt).getTime() - new Date(request.created_at).getTime()) / 1000);

        const { error } = await supabase
            .from('requests')
            .update({
                status: 'completed',
                completed_at: completedAt,
                duration_seconds: durationSeconds
            })
            .eq('id', id);

        if (error) {
            console.error('Error completing request:', error);
        }
    };

    const resetSystem = async () => {
        if (confirm('Are you sure you want to reset the entire system? All records will be lost.')) {
            const { error: reqError } = await supabase.from('requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            const { error: deptError } = await supabase.from('departments').delete().neq('id', '00000000-0000-0000-0000-000000000000');

            if (reqError || deptError) {
                console.error('Error resetting system:', reqError || deptError);
            } else {
                setRequests([]);
            }
        }
    };

    const activeRequests = requests.filter(r => r.status !== 'completed');
    const completedRequests = requests.filter(r => r.status === 'completed');

    return {
        requests,
        activeRequests,
        completedRequests,
        loading,
        updateRequestStatus,
        completeRequest,
        resetSystem
    };
}
