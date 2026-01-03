import { useState } from 'react';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';

type LoginScreenProps = {
    onLogin: (email: string, password: string) => void;
    onSwitchToRegister: () => void;
};

export function LoginScreen({ onLogin, onSwitchToRegister }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setError('');
        onLogin(email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] mb-6 shadow-xl shadow-indigo-100 transform -rotate-6">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-slate-900 mb-2 font-semibold text-3xl tracking-tight">DecisiveVote</h1>
                    <p className="text-slate-500 font-semibold text-xs uppercase tracking-[0.2em]">Secure Digital Democracy</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 sm:p-10 border border-slate-100">
                    <div className="mb-8">
                        <h2 className="text-slate-900 mb-2 font-semibold text-2xl">Voter Access</h2>
                        <p className="text-slate-400 font-medium">Please authenticate to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-slate-800 text-xs font-semibold uppercase tracking-widest pl-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. voter@university.edu"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-slate-800 text-xs font-semibold uppercase tracking-widest pl-1">
                                Security Terminal
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl">
                                <p className="text-red-700 text-xs font-semibold flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-semibold text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform active:scale-[0.98]"
                        >
                            Enter Portal
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-400 font-medium">
                            New user?{' '}
                            <button
                                onClick={onSwitchToRegister}
                                className="text-indigo-600 hover:text-indigo-700 font-semibold decoration-2 hover:underline underline-offset-4"
                            >
                                Register Identity
                            </button>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-8 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.2em] mb-3">Debug Access</p>
                        <div className="space-y-2">
                            <p className="text-slate-600 text-xs flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                                <span className="font-semibold">Voter</span>
                                <code className="text-[10px] text-indigo-600 font-semibold">voter@university.edu / voter123</code>
                            </p>
                            <p className="text-slate-600 text-xs flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                                <span className="font-semibold">Admin</span>
                                <code className="text-[10px] text-indigo-600 font-semibold">admin@vote.com / admin123</code>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2">
                        <ShieldCheck className="w-3 h-3" />
                        Millitary Grade Encryption Active
                    </p>
                </div>
            </div>
        </div>
    );
}

