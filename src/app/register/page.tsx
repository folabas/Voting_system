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

    const handleRegister = async (name: string, email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            login(data.user, data.token);
            router.push('/');
        } catch (err: any) {
            alert(err.message || 'Registration failed');
        }
    };

    return (
        <RegistrationScreen
            onRegister={handleRegister}
            onSwitchToLogin={() => router.push('/login')}
        />
    );
}

