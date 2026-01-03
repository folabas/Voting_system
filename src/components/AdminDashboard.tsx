import { useState } from 'react';
import { Settings, LogOut, BarChart3, Users, Plus, Lock, Unlock, Trash2, Building2, X, Loader2, Image as ImageIcon, Camera } from 'lucide-react';
import { Election, Candidate } from '@/lib/types';

type AdminDashboardProps = {
    elections: Election[];
    onUpdateElections: (elections: Election[]) => void;
    onLogout: () => void;
    onSelectElection: (election: Election) => void;
    selectedElection?: Election | null;
};

export function AdminDashboard({
    elections,
    onUpdateElections,
    onLogout,
    onSelectElection,
    selectedElection: externalSelectedElection
}: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'elections'>('overview');
    const [selectedElection, setSelectedElection] = useState<Election | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state for new election
    const [newElection, setNewElection] = useState({
        title: '',
        description: '',
        category: '',
        department: '',
        faculty: '',
    });

    const [candName, setCandName] = useState('');
    const [candPhoto, setCandPhoto] = useState('');

    const totalVotes = elections.reduce((sum, e) =>
        sum + e.candidates.reduce((candidateSum, c) => candidateSum + c.votes, 0), 0
    );

    const updateElectionOnServer = async (electionId: string, data: Partial<Election>) => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/elections/${electionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const updated = await response.json();
            if (updated.error) throw new Error(updated.error);

            // Re-fetch all elections to stay in sync
            const allRes = await fetch('/api/elections');
            const allData = await allRes.json();
            onUpdateElections(allData);

            // Update selected election view
            if (selectedElection?._id === electionId || selectedElection?.id === electionId) {
                setSelectedElection(updated);
            }
        } catch (err: any) {
            alert(err.message || 'Update failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateElection = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/elections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...newElection,
                    isOpen: true,
                    candidates: []
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            // Re-fetch all
            const allRes = await fetch('/api/elections');
            const allData = await allRes.json();
            onUpdateElections(allData);

            setShowCreateModal(false);
            setNewElection({ title: '', description: '', category: '', department: '', faculty: '' });
            setActiveTab('elections');
            setSelectedElection(data);
        } catch (err: any) {
            alert(err.message || 'Failed to create election');
        }
    };

    const handleDeleteElection = async (electionId: string) => {
        if (!confirm('Are you sure you want to delete this election? This cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/elections/${electionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            // Re-fetch
            const allRes = await fetch('/api/elections');
            const allData = await allRes.json();
            onUpdateElections(allData);

            if (selectedElection?._id === electionId) {
                setSelectedElection(allData[0] || null);
            }
        } catch (err: any) {
            alert(err.message || 'Delete failed');
        }
    };

    const handleToggleElection = (electionId: string) => {
        const election = elections.find(e => (e._id || e.id) === electionId);
        if (election) {
            updateElectionOnServer(electionId, { isOpen: !election.isOpen });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCandPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCandidate = (electionId: string, name: string, position: string, photo?: string) => {
        if (!name.trim()) return;

        const election = elections.find(e => (e._id || e.id) === electionId);
        if (election) {
            const newCandidate = {
                name: name,
                position: position,
                photo: photo?.trim() || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000000)}?w=400`,
                votes: 0
            };
            const updatedCandidates = [...election.candidates, newCandidate];
            updateElectionOnServer(electionId, { candidates: updatedCandidates });
            setCandName('');
            setCandPhoto('');

            // Clear the file input if it exists
            const fileInput = document.getElementById('cand-photo-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        }
    };

    const handleRemoveCandidate = (electionId: string, candidateId: string) => {
        const election = elections.find(e => (e._id || e.id) === electionId);
        if (election) {
            const updatedCandidates = election.candidates.filter(c => (c._id || c.id) !== candidateId);
            updateElectionOnServer(electionId, { candidates: updatedCandidates });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0">
                                <img src="/logo.png" alt="VoteFlow Logo" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-slate-900 font-semibold text-sm sm:text-xl truncate tracking-tight">VoteFlow Admin</h1>
                                <p className="text-slate-500 text-[10px] sm:text-sm truncate">Management System</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md font-semibold text-xs sm:text-sm"
                            >
                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="inline">Add Election</span>
                            </button>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition text-xs sm:text-sm font-medium"
                            >
                                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-b-4 border-indigo-500 hover:shadow-lg transition-shadow">
                        <p className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1 sm:mb-2">Total Votes</p>
                        <div className="flex items-end gap-2">
                            <p className="text-2xl sm:text-4xl font-semibold text-slate-900 leading-none">{totalVotes}</p>
                            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-100" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-b-4 border-purple-500 hover:shadow-lg transition-shadow">
                        <p className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1 sm:mb-2">Active Polls</p>
                        <div className="flex items-end gap-2">
                            <p className="text-2xl sm:text-4xl font-semibold text-slate-900 leading-none">{elections.length}</p>
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-100" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-b-4 border-emerald-500 hover:shadow-lg transition-shadow">
                        <p className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1 sm:mb-2">Candidates</p>
                        <div className="flex items-end gap-2">
                            <p className="text-2xl sm:text-4xl font-semibold text-slate-900 leading-none">
                                {elections.reduce((sum, e) => sum + e.candidates.length, 0)}
                            </p>
                            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-100" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-2 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 font-semibold transition-all ${activeTab === 'overview'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-slate-400 hover:text-slate-900'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('elections')}
                        className={`px-4 py-3 font-semibold transition-all ${activeTab === 'elections'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-slate-400 hover:text-slate-900'
                            }`}
                    >
                        Control Panel
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 gap-6">
                        {elections.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <p className="text-slate-500 mb-4 text-lg">No elections found.</p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                                >
                                    Create Your First Election
                                </button>
                            </div>
                        ) : elections.map((election) => {
                            const electionVotes = election.candidates.reduce((sum, c) => sum + c.votes, 0);
                            return (
                                <div key={election._id || election.id} className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-semibold uppercase tracking-widest border border-indigo-100">
                                                {election.category}
                                            </span>
                                            {(election.department || election.faculty) && (
                                                <span className="px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-[10px] font-semibold uppercase tracking-widest border border-slate-200 flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" />
                                                    {election.department && `Dept: ${election.department}`}
                                                    {election.department && election.faculty && ' • '}
                                                    {election.faculty && `Faculty: ${election.faculty}`}
                                                </span>
                                            )}
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest border ${election.isOpen
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-red-50 text-red-700 border-red-100'
                                                }`}>
                                                {election.isOpen ? 'Open' : 'Closed'}
                                            </span>
                                        </div>
                                        <h3 className="text-slate-900 mb-1 font-semibold text-xl">{election.title}</h3>
                                        <p className="text-slate-500 text-sm mb-4 line-clamp-1 italic">{election.description}</p>
                                        <div className="flex items-center gap-6 text-sm text-slate-500 font-semibold uppercase tracking-tighter">
                                            <span className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-indigo-400" /> {election.candidates.length} Candidates
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <BarChart3 className="w-4 h-4 text-emerald-400" /> {electionVotes} Total Votes
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => onSelectElection(election)}
                                            className="px-6 py-2 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold text-sm shadow-sm"
                                        >
                                            View Stats
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedElection(election);
                                                setActiveTab('elections');
                                            }}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-sm shadow-md"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'elections' && (
                    <div className="space-y-6">
                        {!selectedElection ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-slate-900 font-semibold text-2xl tracking-tight">Election Management Hub</h3>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-semibold text-sm border border-indigo-100"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Election
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {elections.map((election) => (
                                        <div
                                            key={election._id || election.id}
                                            onClick={() => setSelectedElection(election)}
                                            className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4">
                                                <div className={`w-3 h-3 rounded-full ${election.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                            </div>
                                            <div className="mb-4">
                                                <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-[9px] font-semibold uppercase tracking-widest border border-slate-100">
                                                    {election.category}
                                                </span>
                                                {(election.department || election.faculty) && (
                                                    <span className="ml-2 px-2 py-1 bg-slate-50 text-slate-500 rounded text-[9px] font-semibold uppercase tracking-widest border border-slate-100">
                                                        {election.department && `Dept: ${election.department}`}
                                                        {election.department && election.faculty && ' • '}
                                                        {election.faculty && `Faculty: ${election.faculty}`}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="text-slate-900 font-semibold text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                                                {election.title}
                                            </h4>
                                            <p className="text-slate-500 text-xs mb-6 line-clamp-2">
                                                {election.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400">
                                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {election.candidates.length}</span>
                                                    <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {election.candidates.reduce((sum, c) => sum + c.votes, 0)}</span>
                                                </div>
                                                <div className="text-indigo-600 font-semibold text-xs uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
                                                    Configure →
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <button
                                    onClick={() => setSelectedElection(null)}
                                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-semibold text-sm mb-2 group"
                                >
                                    <X className="w-4 h-4 bg-slate-100 rounded-full p-0.5 group-hover:rotate-90 transition-transform" />
                                    Back to Hub
                                </button>

                                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                    <div>
                                        <h3 className="text-2xl font-semibold text-slate-900">{selectedElection.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-slate-500 text-sm italic">Managing settings and candidates</p>
                                            {(selectedElection.department || selectedElection.faculty) && (
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                                                    {selectedElection.department && `Dept: ${selectedElection.department}`}
                                                    {selectedElection.department && selectedElection.faculty && ' • '}
                                                    {selectedElection.faculty && `Faculty: ${selectedElection.faculty}`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteElection(selectedElection._id || selectedElection!.id!)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold text-sm border border-red-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Election
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Election Controls */}
                                    <div className="lg:col-span-1 space-y-6">
                                        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
                                            <h3 className="text-slate-900 mb-6 font-semibold">Status Control</h3>

                                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center text-center gap-4">
                                                {selectedElection.isOpen ? (
                                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                                        <Unlock className="w-8 h-8 text-green-600" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                                        <Lock className="w-8 h-8 text-red-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-slate-900 font-semibold uppercase tracking-tighter">Voting is {selectedElection.isOpen ? 'Active' : 'Locked'}</p>
                                                    <p className="text-slate-500 text-xs mt-1 italic">
                                                        {selectedElection.isOpen ? 'Users can currently cast votes.' : 'The election is paused or closed.'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleToggleElection(selectedElection._id || selectedElection!.id!)}
                                                    className={`w-full py-3 rounded-lg transition font-semibold shadow-md border-2 ${selectedElection.isOpen
                                                        ? 'bg-white border-red-600 text-red-600 hover:bg-red-50'
                                                        : 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                                                        }`}
                                                >
                                                    {selectedElection.isOpen ? '🔒 Close Portal' : '🔓 Open Portal'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-indigo-600 rounded-xl shadow-lg p-6 text-white">
                                            <h3 className="font-semibold mb-2">Pro Tip</h3>
                                            <p className="text-indigo-100 text-sm italic">
                                                Adding high-quality candidate photos increases voter engagement by up to 40%.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Candidates Management */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
                                            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                                                <h3 className="text-slate-900 font-semibold">Candidate Roster</h3>
                                                <span className="text-[10px] font-semibold bg-slate-100 px-2 py-1 rounded-md text-slate-500 uppercase">{selectedElection.candidates.length} Slots Filled</span>
                                            </div>
                                            <div className="p-6 border-b border-slate-200 bg-slate-50">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                value={candName}
                                                                onChange={(e) => setCandName(e.target.value)}
                                                                placeholder="Enter candidate name..."
                                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                                            />
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="file"
                                                                id="cand-photo-upload"
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                            />
                                                            <label
                                                                htmlFor="cand-photo-upload"
                                                                className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition font-semibold text-slate-600 border-dashed"
                                                            >
                                                                {candPhoto ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <img src={candPhoto} alt="Preview" className="w-6 h-6 rounded-full object-cover" />
                                                                        <span className="text-xs">Photo selected</span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <Camera className="w-4 h-4" />
                                                                        <span className="text-xs">Upload Photo</span>
                                                                    </>
                                                                )}
                                                            </label>
                                                            {candPhoto && (
                                                                <button
                                                                    onClick={() => setCandPhoto('')}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        disabled={isSubmitting || !candName.trim()}
                                                        onClick={() => {
                                                            handleAddCandidate(selectedElection._id || selectedElection!.id!, candName, selectedElection.category, candPhoto);
                                                        }}
                                                        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSubmitting ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Plus className="w-4 h-4" />
                                                        )}
                                                        {isSubmitting ? 'Adding...' : 'Add Candidate'}
                                                    </button>
                                                </div>
                                            </div>
                                            {selectedElection.candidates.length === 0 ? (
                                                <div className="p-12 text-center">
                                                    <p className="text-slate-400 italic font-medium">No candidates registered for this position yet.</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-slate-100">
                                                    {selectedElection.candidates.map((candidate) => (
                                                        <div key={candidate._id || candidate.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition border-l-4 border-transparent hover:border-indigo-500">
                                                            <div className="flex items-center gap-4">
                                                                <div className="relative">
                                                                    <img
                                                                        src={candidate.photo}
                                                                        alt={candidate.name}
                                                                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                                                                    />
                                                                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                                                                        <div className="bg-indigo-600 w-3 h-3 rounded-full" />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-slate-900 font-semibold">{candidate.name}</p>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-widest">{candidate.position}</span>
                                                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                                        <span className="text-indigo-600 text-[10px] font-semibold uppercase">{candidate.votes} Votes</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveCandidate(selectedElection._id || selectedElection!.id!, candidate._id || candidate!.id!)}
                                                                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Create Election Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-semibold text-slate-900 tracking-tighter">Initiate New Election</h2>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateElection} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    value={newElection.title}
                                    onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
                                    placeholder="e.g. SRC Presidential Election"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Category</label>
                                <input
                                    required
                                    type="text"
                                    value={newElection.category}
                                    onChange={(e) => setNewElection({ ...newElection, category: e.target.value })}
                                    placeholder="e.g. President, Governor"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Faculty (Optional)</label>
                                <input
                                    type="text"
                                    value={newElection.faculty}
                                    onChange={(e) => setNewElection({ ...newElection, faculty: e.target.value })}
                                    placeholder="e.g. Science, Arts"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Department (Optional)</label>
                                <input
                                    type="text"
                                    value={newElection.department}
                                    onChange={(e) => setNewElection({ ...newElection, department: e.target.value })}
                                    placeholder="e.g. Computer Science"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Summary</label>
                                <textarea
                                    required
                                    value={newElection.description}
                                    onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                                    placeholder="Provide a brief description of this election..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold shadow-lg shadow-indigo-100 transform active:scale-[0.98]"
                            >
                                Launch Election
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

