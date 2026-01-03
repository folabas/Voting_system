"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Timer, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PollCardProps {
    id: string;
    title: string;
    description: string;
    votes: number;
    timeLeft: string;
    category: string;
    status: 'active' | 'ended';
}

export const PollCard = ({ id, title, description, votes, timeLeft, category, status }: PollCardProps) => {
    return (
        <Link href={`/poll/${id}`} className="block h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 flex flex-col h-full gap-4 group cursor-pointer transition-all duration-300"
            >
                <div className="flex items-start justify-between">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                        category === 'Technology' ? "bg-blue-500/20 text-blue-400" :
                            category === 'Design' ? "bg-purple-500/20 text-purple-400" :
                                "bg-emerald-500/20 text-emerald-400"
                    )}>
                        {category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-white/5 px-2.5 py-1 rounded-lg">
                        <Timer className="w-3.5 h-3.5" />
                        {timeLeft}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px]">
                                    👤
                                </div>
                            ))}
                        </div>
                        <span className="font-semibold">{votes.toLocaleString()} votes</span>
                    </div>

                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

