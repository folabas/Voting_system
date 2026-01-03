import { CheckCircle, BarChart3, LogOut, Home } from 'lucide-react';

type VoteSuccessScreenProps = {
    onViewResults: () => void;
    onBackToHome: () => void;
    onLogout: () => void;
};

export function VoteSuccessScreen({ onViewResults, onBackToHome, onLogout }: VoteSuccessScreenProps) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-green-50">
            <div className="w-full max-w-md">
                {/* Success Icon */}
                <div className="flex justify-center mb-10">
                    <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200 animate-in zoom-in duration-500 transform rotate-6 border-4 border-white">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Success Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 border border-slate-100 text-center relative overflow-hidden">
                    {/* Decorative pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 z-0" />

                    <div className="relative z-10">
                        <h1 className="text-slate-900 mb-2 text-2xl font-semibold tracking-tight leading-tight">Vote Successfully Recorded</h1>
                        <p className="text-slate-400 mb-8 font-medium text-sm px-4">
                            Your contribution to the democratic process has been safely encrypted and added to the ledger.
                        </p>

                        {/* Status Grid */}
                        <div className="grid grid-cols-1 gap-2 mb-8">
                            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <p className="text-emerald-800 text-[10px] font-semibold uppercase tracking-widest text-left">Transmission verified</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                <p className="text-indigo-800 text-[10px] font-semibold uppercase tracking-widest text-left">Identity anonymized</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={onViewResults}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-semibold text-sm shadow-lg shadow-indigo-100"
                            >
                                <BarChart3 className="w-5 h-5" />
                                View Live Analytics
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={onBackToHome}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all font-semibold text-xs border border-slate-200/50"
                                >
                                    <Home className="w-4 h-4" />
                                    Portal Home
                                </button>

                                <button
                                    onClick={onLogout}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-semibold text-xs border border-red-200/50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Terminate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center px-6">
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest leading-relaxed">
                        Validation code: <span className="font-mono text-slate-500">{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

