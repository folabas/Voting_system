"use client";

import { RegistrationScreen } from "@/components/RegistrationScreen";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
    const { login, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    return (
        <RegistrationScreen
            onSwitchToLogin={() => router.push('/login')}
        />
    );
}

