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

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            login(data.user, data.token);
            router.push(data.user.role === 'admin' ? '/admin' : '/');
        } catch (err: any) {
            alert(err.message || 'Login failed');
        }
    };

    return (
        <LoginScreen
            onLogin={handleLogin}
            onSwitchToRegister={() => router.push('/register')}
        />
    );
}

