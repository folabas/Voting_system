import { useState } from 'react';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';

type RegistrationScreenProps = {
    onRegister: (name: string, email: string, password: string) => void;
    onSwitchToLogin: () => void;
};

export function RegistrationScreen({ onRegister, onSwitchToLogin }: RegistrationScreenProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        onRegister(name, email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-xl shadow-indigo-100 transform rotate-3">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-slate-900 mb-2 font-semibold text-2xl tracking-tight">DecisiveVote</h1>
                    <p className="text-slate-500 font-semibold text-[10px] uppercase tracking-widest">Create Your Voter Identity</p>
                </div>

                {/* Registration Card */}
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 p-6 sm:p-8 border border-slate-100">
                    <div className="mb-6">
                        <h2 className="text-slate-900 mb-1 font-semibold text-xl">Register Account</h2>
                        <p className="text-slate-400 font-medium text-sm">Join the secure democratic process.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name Input */}
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="block text-slate-800 text-[10px] font-semibold uppercase tracking-widest pl-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all font-medium text-sm"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-slate-800 text-[10px] font-semibold uppercase tracking-widest pl-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="student@university.edu"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all font-medium text-sm"
                                />
                            </div>
                        </div>

                        {/* Password Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor="password" className="block text-slate-800 text-[10px] font-semibold uppercase tracking-widest pl-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="confirmPassword" className="block text-slate-800 text-[10px] font-semibold uppercase tracking-widest pl-1">
                                    Confirm
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                                <p className="text-red-700 text-[10px] font-semibold">{error}</p>
                            </div>
                        )}

                        {/* Register Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold text-sm shadow-lg shadow-indigo-100 transform active:scale-[0.98] mt-2"
                        >
                            Finalize Registration
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center bg-slate-50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 rounded-b-[2rem] border-t border-slate-100">
                        <p className="text-slate-400 text-sm font-medium">
                            Already registered?{' '}
                            <button
                                onClick={onSwitchToLogin}
                                className="text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                                Sign In Portal
                            </button>
                        </p>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest">
                        🔒 End-to-End Cryptographic Protection
                    </p>
                </div>
            </div>
        </div>
    );
}

