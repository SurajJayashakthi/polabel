import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ensures this route is always dynamically executed
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Verify the authorization header if you want to secure this endpoint
        // You can set CRON_SECRET in your Vercel/environment variables
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Perform a lightweight query to Supabase to keep it active
        // This triggers a database operation which counts as activity and prevents pausing
        const { data, error } = await supabase
            .from('departments')
            .select('id')
            .limit(1);

        if (error) {
            console.error('Supabase ping failed:', error);
            return NextResponse.json({ error: 'Failed to ping Supabase' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Supabase pinged successfully to prevent pausing.',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Cron job error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
