import { ShieldAlert, BarChart3, LogOut, Home } from 'lucide-react';

type AlreadyVotedScreenProps = {
    electionTitle: string;
    onViewResults: () => void;
    onBackToHome: () => void;
    onLogout: () => void;
};

export function AlreadyVotedScreen({ electionTitle, onViewResults, onBackToHome, onLogout }: AlreadyVotedScreenProps) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-orange-50">
            <div className="w-full max-w-md">
                {/* Alert Icon */}
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-orange-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-orange-200 transform -rotate-3 border-4 border-white">
                        <ShieldAlert className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Message Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 border border-slate-100 text-center">
                    <h1 className="text-slate-900 mb-3 text-2xl font-semibold tracking-tight">Access Restricted</h1>
                    <p className="text-slate-400 mb-6 font-medium text-sm">
                        Our security protocols indicate a previous entry for:
                    </p>
                    <div className="p-4 bg-indigo-50 rounded-2xl mb-8 border border-indigo-100">
                        <p className="text-indigo-600 font-semibold text-lg leading-tight uppercase tracking-tight">
                            {electionTitle}
                        </p>
                    </div>

                    {/* Info Notice */}
                    <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.2em] mb-3">Integrity Protocol</p>
                        <p className="text-slate-600 text-xs font-medium leading-relaxed italic">
                            "To ensure absolute fairness, each verified identity is permitted exactly one submission per election cycle. Your previous vote is securely encrypted and finalized."
                        </p>
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

                {/* Footer */}
                <div className="mt-8 text-center px-6">
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest leading-relaxed">
                        Security concerns? Contact the <span className="text-indigo-500 underline underline-offset-2">Chief Election Auditor</span> for assistance.
                    </p>
                </div>
            </div>
        </div>
    );
}

