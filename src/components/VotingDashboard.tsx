import { LogOut, Vote, Info, ArrowLeft, Building2 } from 'lucide-react';
import { Election, Candidate } from '@/lib/types';

type VotingDashboardProps = {
    election: Election;
    selectedCandidate: Candidate | null;
    onSelectCandidate: (candidate: Candidate) => void;
    onSubmitVote: () => void;
    onBack: () => void;
    onLogout: () => void;
    userName: string;
};

export function VotingDashboard({
    election,
    selectedCandidate,
    onSelectCandidate,
    onSubmitVote,
    onBack,
    onLogout,
    userName
}: VotingDashboardProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition text-xs sm:text-sm font-medium border border-transparent hover:border-slate-200"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="inline">Go to Home</span>
                        </button>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-slate-900 font-semibold text-sm sm:text-base truncate">Voting Portal</h1>
                            <p className="text-slate-600 text-[10px] sm:text-sm truncate">User: {userName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition text-xs sm:text-sm font-medium"
                    >
                        <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                        <span className="inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
                {/* Election Info */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                        <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                            {election.category}
                        </span>
                        {(election.department || election.faculty) && (
                            <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] sm:text-xs flex items-center gap-1 font-semibold uppercase tracking-wider">
                                <Building2 className="w-3 h-3" />
                                {election.department && `Dept: ${election.department}`}
                                {election.department && election.faculty && ' • '}
                                {election.faculty && `Faculty: ${election.faculty}`}
                            </span>
                        )}
                    </div>
                    <h2 className="text-slate-900 mb-2 text-xl sm:text-3xl font-semibold">{election.title}</h2>
                    <p className="text-slate-600 text-sm sm:text-base line-clamp-3 sm:line-clamp-none italic">{election.description}</p>
                </div>

                {/* Important Notice */}
                <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 sm:gap-3">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-amber-900 text-xs sm:text-sm">
                            <span className="font-semibold">Important Notice:</span> You can only cast ONE vote per position. Choose wisely, as your decision is final and cannot be modified once submitted.
                        </p>
                    </div>
                </div>

                {/* Candidates Grid */}
                <div className="mb-20 sm:mb-24">
                    <h3 className="text-slate-900 mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold tracking-tight">Select Your Candidate</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {election.candidates.map((candidate) => (
                            <button
                                key={candidate._id || candidate.id}
                                onClick={() => onSelectCandidate(candidate)}
                                className={`relative bg-white rounded-2xl overflow-hidden border-2 transition-all hover:shadow-xl group ${selectedCandidate && (selectedCandidate._id || selectedCandidate.id) === (candidate._id || candidate.id)
                                    ? 'border-indigo-600 shadow-xl ring-4 ring-indigo-50 transform scale-[1.02]'
                                    : 'border-slate-100 hover:border-indigo-200'
                                    }`}
                            >
                                {/* Radio Indicator */}
                                <div className="absolute top-3 right-3 z-10">
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedCandidate && (selectedCandidate._id || selectedCandidate.id) === (candidate._id || candidate.id)
                                            ? 'border-indigo-600 bg-indigo-600'
                                            : 'border-white bg-black/20 backdrop-blur-sm'
                                            }`}
                                    >
                                        {selectedCandidate && (selectedCandidate._id || selectedCandidate.id) === (candidate._id || candidate.id) && (
                                            <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                        )}
                                    </div>
                                </div>

                                {/* Candidate Photo */}
                                <div className="aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-100 relative">
                                    <img
                                        src={candidate.photo}
                                        alt={candidate.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* Candidate Info */}
                                <div className="p-4 sm:p-5 text-center">
                                    <h4 className="text-slate-900 mb-1 font-semibold text-lg">{candidate.name}</h4>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">{candidate.position}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Fixed Submit Container for Mobile */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-30 sm:relative sm:bg-transparent sm:border-0 sm:p-0 sm:flex sm:justify-center">
                    <button
                        onClick={onSubmitVote}
                        disabled={!selectedCandidate}
                        className={`w-full sm:w-auto sm:px-12 py-4 rounded-xl transition-all font-semibold text-lg shadow-lg border-2 ${selectedCandidate
                            ? 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]'
                            : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {selectedCandidate ? 'Confirm & Cast Vote' : 'Select a Candidate'}
                    </button>
                </div>
            </main>
        </div>
    );
}

