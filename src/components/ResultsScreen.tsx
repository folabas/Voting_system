import { ArrowLeft, LogOut, Trophy, Users, Home, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Election } from '@/lib/types';

type ResultsScreenProps = {
    election: Election;
    onBack: () => void;
    onLogout: () => void;
    isAdmin?: boolean;
};

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export function ResultsScreen({ election, onBack, onLogout, isAdmin }: ResultsScreenProps) {
    const totalVotes = election.candidates.reduce((sum, c) => sum + c.votes, 0);

    const chartData = election.candidates.map(c => ({
        name: c.name,
        votes: c.votes,
        percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0
    })).sort((a, b) => b.votes - a.votes);

    const winner = chartData[0];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition text-xs sm:text-sm font-medium border border-transparent hover:border-slate-200"
                    >
                        <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="inline">{isAdmin ? 'Go to Dashboard' : 'Go to Home'}</span>
                    </button>
                    <h1 className="text-slate-900 font-semibold text-sm sm:text-lg absolute left-1/2 -translate-x-1/2 whitespace-nowrap">Live Results</h1>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition text-xs sm:text-sm font-medium"
                    >
                        <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
                {/* Election Title */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
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
                    <h2 className="text-slate-900 mb-2 font-semibold text-xl sm:text-4xl tracking-tight">{election.title}</h2>
                    <div className="flex items-center justify-center gap-3 text-slate-500 font-semibold text-[10px] sm:text-xs uppercase tracking-widest">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                        <span>Participation: <span className="text-slate-900">{totalVotes}</span> Verified Votes</span>
                    </div>
                </div>

                {/* Winner Card */}
                {totalVotes > 0 && (
                    <div className="mb-8 bg-gradient-to-br from-yellow-50 to-amber-100 border-2 border-yellow-300 rounded-2xl p-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Trophy className="w-8 h-8 text-yellow-600" />
                            <h3 className="text-amber-900 font-semibold">Current Leader</h3>
                        </div>
                        <div className="text-center">
                            <img
                                src={election.candidates.find(c => c.name === winner.name)?.photo}
                                alt={winner.name}
                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-yellow-400 shadow-lg"
                            />
                            <h2 className="text-slate-900 mb-2 font-semibold text-xl">{winner.name}</h2>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-slate-700 font-medium">{winner.votes} votes</span>
                                <span className="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-full font-semibold">
                                    {winner.percentage}%
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bar Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h3 className="text-slate-900 mb-6 text-center font-semibold">Vote Distribution</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        padding: '12px'
                                    }}
                                />
                                <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Results */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                    <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-slate-900 font-semibold">Detailed Breakdown</h3>
                        <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded uppercase tracking-tighter">Verified Data</span>
                    </div>

                    {/* Mobile View: Cards */}
                    <div className="block sm:hidden divide-y divide-slate-100">
                        {chartData.map((candidate, index) => {
                            const candidateData = election.candidates.find(c => c.name === candidate.name);
                            return (
                                <div key={candidate.name} className="p-4 bg-white hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img
                                                    src={candidateData?.photo}
                                                    alt={candidate.name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
                                                />
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-slate-900 text-white rounded-full text-[10px] flex items-center justify-center font-semibold">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-semibold text-sm">{candidate.name}</p>
                                                <p className="text-indigo-600 font-semibold text-[10px] uppercase">{candidate.votes} Votes • {candidate.percentage}%</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                                        <div
                                            className="h-1.5 rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${candidate.percentage}%`,
                                                backgroundColor: COLORS[index % COLORS.length]
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop View: Table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Rank</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Candidate</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Votes</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Percentage</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Distribution</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {chartData.map((candidate, index) => {
                                    const candidateData = election.candidates.find(c => c.name === candidate.name);
                                    return (
                                        <tr key={candidate.name} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-lg font-semibold text-xs">
                                                    #{index + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={candidateData?.photo}
                                                        alt={candidate.name}
                                                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                                    />
                                                    <span className="text-slate-900 font-semibold text-sm">{candidate.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-900 font-semibold">
                                                {candidate.votes}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                                                    {candidate.percentage}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-32 lg:w-48 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="h-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${candidate.percentage}%`,
                                                            backgroundColor: COLORS[index % COLORS.length]
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Notice */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                    <p className="text-blue-900 text-sm font-medium">
                        These results are updated in real-time. Final results will be announced after the voting period ends.
                    </p>
                </div>
            </main>
        </div>
    );
}

