import { AlertTriangle, X } from 'lucide-react';
import { Candidate } from '@/lib/types';

type VoteConfirmationModalProps = {
    candidate: Candidate;
    onConfirm: () => void;
    onCancel: () => void;
};

export function VoteConfirmationModal({
    candidate,
    onConfirm,
    onCancel
}: VoteConfirmationModalProps) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[2.5rem] max-w-sm w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/20">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center border-2 border-amber-100/50 shadow-inner">
                        <AlertTriangle className="w-10 h-10 text-amber-500 animate-pulse" />
                    </div>
                </div>

                <h3 className="text-slate-900 text-center mb-2 text-2xl font-semibold tracking-tight">Voter Verification</h3>
                <p className="text-slate-400 text-center text-xs font-semibold uppercase tracking-widest mb-8">Confirm Transmission</p>

                <div className="mb-8 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-4">
                    <div className="relative group">
                        <img
                            src={candidate.photo}
                            alt={candidate.name}
                            className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-white shadow-xl transition-transform group-hover:scale-110 duration-500"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white rounded-lg px-2 py-1 text-[8px] font-semibold uppercase tracking-tighter shadow-lg">
                            Selected
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-indigo-600 text-[10px] font-semibold uppercase tracking-[0.2em] mb-1">{candidate.position}</p>
                        <p className="text-slate-900 font-semibold text-lg leading-tight">{candidate.name}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onConfirm}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-100 active:scale-[0.98]"
                    >
                        Cast Absolute Vote
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full py-4 bg-white text-slate-400 rounded-2xl hover:text-slate-600 transition-all font-semibold text-sm"
                    >
                        Abort Transaction
                    </button>
                </div>
            </div>
        </div>
    );
}

