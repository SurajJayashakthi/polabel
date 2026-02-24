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
    const [serverOffset, setServerOffset] = useState(0);

    useEffect(() => {
        const syncTime = async () => {
            try {
                const startTime = Date.now();
                const { data: serverTime, error } = await supabase.rpc('get_server_time');
                const endTime = Date.now();

                if (serverTime && !error) {
                    // Estimate latency as half the round trip
                    const latency = (endTime - startTime) / 2;
                    const serverMs = new Date(serverTime).getTime();
                    // serverOffset = (serverTime + latency) - localTime
                    const offset = (serverMs + latency) - endTime;
                    setServerOffset(offset);
                }
            } catch (err) {
                console.error('Error syncing time:', err);
            }
        };

        syncTime();
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

    const completeRequest = async (id: string, completedPos?: string[]) => {
        const request = requests.find(r => r.id === id);
        if (!request) return;

        const allPos = request.po_numbers.split(/[\s,]+/).filter(Boolean);
        const finalCompletedPos = completedPos || allPos;
        const remainingPos = allPos.filter(po => !finalCompletedPos.includes(po));


        if (remainingPos.length === 0) {
            // Full completion
            const { error } = await supabase
                .from('requests')
                .update({
                    status: 'completed',
                    po_numbers: finalCompletedPos.join(', ') // Normalized
                })
                .eq('id', id);

            if (error) console.error('Error completing request:', error);
        } else {
            // Partial completion - Split record
            // 1. Create a completion record for finished items
            const { error: insertError } = await supabase
                .from('requests')
                .insert({
                    line_id: request.line_id,
                    requested_by: request.requested_by,
                    department: request.department,
                    required_time: request.required_time,
                    po_numbers: finalCompletedPos.join(', '),
                    status: 'completed',
                    created_at: request.created_at
                });

            if (insertError) {
                console.error('Error creating partial completion record:', insertError);
                return;
            }

            // 2. Update original record to remove finished items
            const { error: updateError } = await supabase
                .from('requests')
                .update({
                    po_numbers: remainingPos.join(', ')
                })
                .eq('id', id);

            if (updateError) console.error('Error updating original request:', updateError);
        }
    };

    const batchCompleteRequests = async (ids: string[]) => {
        const requestsToComplete = requests.filter(r => ids.includes(r.id));
        if (requestsToComplete.length === 0) return;

        const updates = requestsToComplete.map(req => completeRequest(req.id));
        await Promise.all(updates);
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
        serverOffset,
        updateRequestStatus,
        completeRequest,
        batchCompleteRequests,
        resetSystem
    };
}
