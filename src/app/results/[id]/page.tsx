"use client";

import { ResultsScreen } from "@/components/ResultsScreen";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import { Election } from "@/lib/types";

export default function ResultsPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const [election, setElection] = useState<Election | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (id) {
            const fetchElection = async () => {
                try {
                    const response = await fetch('/api/elections');
                    const data: Election[] = await response.json();
                    const found = data.find(e => (e._id || e.id) === id);
                    if (found) setElection(found);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchElection();
        }
    }, [id]);

    if (isLoading || !election) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <ResultsScreen
            election={election}
            onBack={() => router.back()}
            onLogout={logout}
            isAdmin={user?.role === 'admin'}
        />
    );
}
