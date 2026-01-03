"use client";

import { HomePage } from "@/components/HomePage";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Election } from "@/lib/types";

export default function RootPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [elections, setElections] = useState<Election[]>([]);

  const fetchElections = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      // Adding cache: 'no-store' to ensure mobile browsers don't serve stale voting status
      const response = await fetch('/api/elections', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        cache: 'no-store'
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setElections(data);
    } catch (err: any) {
      console.error('Failed to fetch elections:', err);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        fetchElections();
      }
    }
  }, [user, isLoading, router, fetchElections]);

  const handleSelectElection = (election: Election) => {
    const electionId = (election._id || election.id || '').toString();
    const hasVoted = getUserVotingStatus(election);

    if (hasVoted) {
      router.push(`/results/${electionId}`);
    } else {
      router.push(`/vote/${electionId}`);
    }
  };

  const getUserVotingStatus = (election: Election): boolean => {
    if (!user) return false;
    const electionId = (election._id || election.id || '').toString();
    const userId = (user.id || user._id || '').toString();

    // Check both verified API status and local fallback
    return election.hasVoted === true || localStorage.getItem(`voted_${userId}_${electionId}`) === 'true';
  };

  if (isLoading || !user || user.role === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <HomePage
      elections={elections}
      onSelectElection={handleSelectElection}
      onLogout={logout}
      userName={user.name}
      getUserVotingStatus={getUserVotingStatus}
    />
  );
}

