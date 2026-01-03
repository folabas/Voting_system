"use client";

import React from 'react';
import { Vote, Plus, LayoutDashboard, History } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
    onCreatePoll: () => void;
}

export const Navbar = ({ onCreatePoll }: NavbarProps) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                        <Vote className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-semibold tracking-tight">
                        VOTE<span className="text-primary">FLOW</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <Link href="/history" className="hover:text-white transition-colors flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Past Polls
                    </Link>
                </div>

                <button 
          onClick={onCreatePoll}
          className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        >
                    <Plus className="w-4 h-4" />
                    Create Poll
                </button>
            </div>
        </nav>
    );
};

