"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FileText, Send } from "lucide-react";

export default function NewRequest() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        line_id: "",
        po_numbers: "",
        required_time: "",
        requested_by: "",
        department: "Sewing"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Ensure department exists (or create it)
            const { data: deptData } = await supabase
                .from('departments')
                .select('id')
                .eq('name', formData.department)
                .single();

            if (!deptData) {
                await supabase.from('departments').insert([{ name: formData.department }]);
            }

            // 2. Insert request
            const { error } = await supabase
                .from('requests')
                .insert([{
                    line_id: formData.line_id,
                    po_numbers: formData.po_numbers,
                    required_time: formData.required_time,
                    requested_by: formData.requested_by,
                    status: 'pending' // default
                }]);

            if (error) throw error;

            router.push("/");
        } catch (error) {
            console.error("Error creating request:", error);
            alert("Failed to create request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <FileText size={28} color="var(--accent-blue)" />
                <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>New PO Request</h2>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Line ID</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. L-12"
                            value={formData.line_id}
                            onChange={e => setFormData({ ...formData, line_id: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Requested By</label>
                        <input
                            required
                            type="text"
                            placeholder="Supervisor Name"
                            value={formData.requested_by}
                            onChange={e => setFormData({ ...formData, requested_by: e.target.value })}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>PO Numbers</label>
                    <textarea
                        required
                        rows={3}
                        placeholder="e.g. 4500123, 4500124"
                        value={formData.po_numbers}
                        onChange={e => setFormData({ ...formData, po_numbers: e.target.value })}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Required Time</label>
                        <input
                            required
                            type="time"
                            value={formData.required_time}
                            onChange={e => setFormData({ ...formData, required_time: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Department</label>
                        <select
                            value={formData.department}
                            onChange={e => setFormData({ ...formData, department: e.target.value })}
                        >
                            <option value="Sewing">Sewing</option>
                            <option value="Cutting">Cutting</option>
                            <option value="MQA">MQA</option>
                            <option value="Finishing">Finishing</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ padding: '0.75rem 2rem', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Submitting...' : <><Send size={18} /> Submit Request</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
