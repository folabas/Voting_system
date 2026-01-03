"use client";

import { LoginScreen } from "@/components/LoginScreen";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { login, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push(user.role === 'admin' ? '/admin' : '/');
        }
    }, [user, router]);

    return (
        <LoginScreen
            onSwitchToRegister={() => router.push('/register')}
        />
    );
}

