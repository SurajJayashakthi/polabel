"use client";

import { LineForm } from '@/components/LineForm';
import { motion } from 'framer-motion';

export default function LineView() {
    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-primary)',
            padding: '1.5rem',
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
                <LineForm />
            </motion.div>

            <footer style={{
                marginTop: '3rem',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                fontWeight: 600,
                opacity: 0.5
            }}>
                RMW LABEL PO SYSTEM v2.0
            </footer>
        </main>
    );
}
