"use client";

import { VoteSuccessScreen } from "@/components/VoteSuccessScreen";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const { logout } = useAuth();
    const router = useRouter();

    return (
        <VoteSuccessScreen
            onViewResults={() => router.push('/')} // Home usually shows latest
            onBackToHome={() => router.push('/')}
            onLogout={logout}
        />
    );
}

