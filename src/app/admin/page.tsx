"use client";

import { AdminDashboard } from "@/components/AdminDashboard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Election } from "@/lib/types";

export default function AdminPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [elections, setElections] = useState<Election[]>([]);

    const fetchElections = useCallback(async () => {
        try {
            const response = await fetch('/api/elections');
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setElections(data);
        } catch (err: any) {
            console.error('Failed to fetch elections:', err);
        }
    }, []);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
        if (user && user.role === 'admin') {
            fetchElections();
        }
    }, [user, isLoading, router, fetchElections]);

    if (isLoading || !user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <AdminDashboard
            elections={elections}
            onUpdateElections={(updated) => setElections(updated)}
            onLogout={logout}
            onSelectElection={(election) => router.push(`/results/${election._id || election.id}`)}
        />
    );
}

