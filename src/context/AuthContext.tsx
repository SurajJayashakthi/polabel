"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

type Role = 'admin' | 'workstation' | 'line' | null;

interface AuthContextType {
    user: User | null;
    role: Role;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchUserAndRole = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setUser(session.user);
                const { data: roleData } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (roleData) {
                    setRole(roleData.role as Role);
                }
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        };

        fetchUserAndRole();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                setUser(session.user);
                const { data: roleData } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (roleData) {
                    setRole(roleData.role as Role);
                }
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
