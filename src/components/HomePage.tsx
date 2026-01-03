import { LogOut, CheckCircle, Clock, Trophy, Users, Building2, Vote } from 'lucide-react';
import { Election } from '@/lib/types';

type HomePageProps = {
    elections: Election[];
    onSelectElection: (election: Election) => void;
    onLogout: () => void;
    userName: string;
    getUserVotingStatus: (election: Election) => boolean;
};

export function HomePage({
    elections,
    onSelectElection,
    onLogout,
    userName,
    getUserVotingStatus
}: HomePageProps) {
    const getElectionStats = () => {
        const total = elections.length;
        const voted = elections.filter(e => getUserVotingStatus(e)).length;
        const pending = total - voted;
        return { total, voted, pending };
    };

    const stats = getElectionStats();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="/logo.png" alt="VoteFlow Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-slate-900 font-semibold text-sm sm:text-lg truncate tracking-tight">VoteFlow</h1>
                            <p className="text-slate-600 text-[10px] sm:text-xs">Welcome, <span className="font-semibold text-indigo-600">{userName}</span></p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition text-xs sm:text-sm font-medium border border-transparent hover:border-slate-200"
                    >
                        <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-slate-900 mb-2 text-xl sm:text-2xl font-semibold">Active Elections</h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                        Select an election below to cast your vote. You can vote in multiple elections.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4 border-indigo-600 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Total</p>
                                <p className="text-lg sm:text-2xl font-semibold text-slate-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4 border-green-600 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Completed</p>
                                <p className="text-lg sm:text-2xl font-semibold text-slate-900">{stats.voted}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4 border-amber-600 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Pending</p>
                                <p className="text-lg sm:text-2xl font-semibold text-slate-900">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Elections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {elections.map((election) => {
                        const hasVoted = getUserVotingStatus(election);
                        const totalVotes = election.candidates.reduce((sum, c) => sum + c.votes, 0);
                        const leader = election.candidates.reduce((prev, current) =>
                            (current.votes > (prev?.votes || 0)) ? current : prev,
                            election.candidates[0] || null
                        );

                        return (
                            <div
                                key={election._id || election.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-slate-200 hover:border-indigo-300 transition-all hover:shadow-xl"
                            >
                                {/* Election Header */}
                                <div className="p-4 sm:p-6 border-b border-slate-200">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
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
                                                {hasVoted && (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] sm:text-xs flex items-center gap-1 font-semibold uppercase tracking-wider">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Voted
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-slate-900 mb-2 font-semibold text-base sm:text-xl truncate">{election.title}</h3>
                                            <p className="text-slate-600 text-xs sm:text-sm line-clamp-2">{election.description}</p>
                                        </div>
                                    </div>

                                    {/* Election Stats */}
                                    <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-tighter">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                                            <span>{election.candidates.length} candidates</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Vote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                                            <span>{totalVotes} votes</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Leader Preview */}
                                {totalVotes > 0 && (
                                    <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 border-b border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 relative">
                                                <img
                                                    src={leader.photo}
                                                    alt={leader.name}
                                                    className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
                                                />
                                                <Trophy className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 bg-white rounded-full p-0.5 shadow-sm" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-slate-900 text-xs sm:text-sm font-semibold truncate">{leader.name}</p>
                                                <p className="text-slate-500 text-[10px] sm:text-xs font-medium italic">Leading with {leader.votes} votes</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Button */}
                                <div className="p-4 sm:p-6">
                                    <button
                                        onClick={() => onSelectElection(election)}
                                        className={`w-full py-2.5 sm:py-3 rounded-lg transition-all font-semibold text-sm sm:text-base border-2 shadow-sm ${hasVoted
                                            ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                            : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                                            }`}
                                    >
                                        {hasVoted ? 'View Live Stats' : 'Cast Your Vote'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info Notice */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-blue-900 text-sm text-center">
                        🔒 <span className="font-semibold">Your privacy is protected:</span> All votes are encrypted and anonymous.
                        You can vote in multiple elections, but only once per election.
                    </p>
                </div>
            </main>
        </div>
    );
}

