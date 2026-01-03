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
      const response = await fetch('/api/elections');
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
    const id = election._id || election.id;
    const hasVoted = localStorage.getItem(`voted_${user?.id || user?._id}_${id}`) === 'true';

    if (hasVoted) {
      router.push(`/results/${id}`);
    } else {
      router.push(`/vote/${id}`);
    }
  };

  const getUserVotingStatus = (electionId: string): boolean => {
    if (!user) return false;
    return localStorage.getItem(`voted_${user.id || user._id}_${electionId}`) === 'true';
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

