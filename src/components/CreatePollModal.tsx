"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Send } from 'lucide-react';

interface CreatePollModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreatePollModal = ({ isOpen, onClose }: CreatePollModalProps) => {
    const [options, setOptions] = useState(['', '']);

    const addOption = () => setOptions([...options, '']);
    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-xl glass-card p-8 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-3xl font-semibold mb-2">Create New Poll</h2>
                        <p className="text-slate-400 mb-8">Set up your question and options to start gathering votes.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-300">Poll Question</label>
                                <input
                                    type="text"
                                    placeholder="What would you like to ask?"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-300">Options</label>
                                {options.map((option, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                                        />
                                        {options.length > 2 && (
                                            <button
                                                onClick={() => removeOption(index)}
                                                className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addOption}
                                    className="w-full py-3 rounded-xl border border-dashed border-white/20 text-slate-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Another Option
                                </button>
                            </div>

                            <div className="pt-4">
                                <button className="w-full bg-primary py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                                    <Send className="w-5 h-5" />
                                    Launch Poll
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

