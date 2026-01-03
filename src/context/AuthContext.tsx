"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }
        setIsLoading(false);
    }, []);

    // Inactivity Logout Logic (3 hours)
    useEffect(() => {
        if (!user) return;

        let inactivityTimeout: NodeJS.Timeout;
        const INACTIVITY_LIMIT = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

        const resetTimer = () => {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(() => {
                console.log('Inactivity limit reached. Logging out...');
                logout();
            }, INACTIVITY_LIMIT);
        };

        const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove'];
        events.forEach(event => document.addEventListener(event, resetTimer));

        resetTimer(); // Initialize timer

        return () => {
            clearTimeout(inactivityTimeout);
            events.forEach(event => document.removeEventListener(event, resetTimer));
        };
    }, [user]);

    const login = (userData: User, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

