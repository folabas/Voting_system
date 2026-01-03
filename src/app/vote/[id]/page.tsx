"use client";

import { VotingDashboard } from "@/components/VotingDashboard";
import { VoteConfirmationModal } from "@/components/VoteConfirmationModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Election, Candidate } from "@/lib/types";

export default function VotePage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [election, setElection] = useState<Election | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const fetchElection = useCallback(async () => {
        try {
            const response = await fetch('/api/elections');
            const data: Election[] = await response.json();
            const found = data.find(e => (e._id || e.id) === id);

            if (found) {
                setElection(found);
                // Check if already voted
                const voted = localStorage.getItem(`voted_${user?.id || user?._id}_${id}`);
                if (voted === 'true') {
                    router.push(`/results/${id}`);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [id, user, router]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        } else if (user && id) {
            fetchElection();
        }
    }, [user, isLoading, id, router, fetchElection]);

    const handleConfirmVote = async () => {
        if (selectedCandidate && user && election) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/vote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        electionId: election._id || election.id,
                        candidateId: selectedCandidate._id || selectedCandidate.id
                    }),
                });

                const data = await response.json();
                if (data.error) throw new Error(data.error);

                localStorage.setItem(`voted_${user.id || user._id}_${id}`, 'true');
                router.push('/success');
            } catch (err: any) {
                alert(err.message || 'Voting failed');
            }
        }
    };

    if (isLoading || !election || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <>
            <VotingDashboard
                election={election}
                selectedCandidate={selectedCandidate}
                onSelectCandidate={setSelectedCandidate}
                onSubmitVote={() => setShowConfirmModal(true)}
                onBack={() => router.push('/')}
                onLogout={logout}
                userName={user.name}
            />

            {showConfirmModal && selectedCandidate && (
                <VoteConfirmationModal
                    candidate={selectedCandidate}
                    onConfirm={handleConfirmVote}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
        </>
    );
}
