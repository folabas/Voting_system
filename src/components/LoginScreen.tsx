import { useState } from 'react';
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type LoginScreenProps = {
    onSwitchToRegister: () => void;
};

export function LoginScreen({ onSwitchToRegister }: LoginScreenProps) {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        if (!email) {
            setFieldErrors(prev => ({ ...prev, email: 'Email identity required' }));
            return;
        }
        if (!password) {
            setFieldErrors(prev => ({ ...prev, password: 'Security password required' }));
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.error) {
                if (data.error.toLowerCase().includes('password')) {
                    setFieldErrors({ password: data.error });
                } else if (data.error.toLowerCase().includes('user') || data.error.toLowerCase().includes('email')) {
                    setFieldErrors({ email: data.error });
                } else {
                    setError(data.error);
                }
                return;
            }

            login(data.user, data.token);
            router.push(data.user.role === 'admin' ? '/admin' : '/');
        } catch (err: any) {
            setError('Connection failed. Please check your network.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] mb-6 shadow-xl shadow-indigo-100 transform -rotate-6 overflow-hidden">
                        <img src="/logo.png" alt="VoteFlow Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-slate-900 mb-2 font-semibold text-3xl tracking-tight">VoteFlow</h1>
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
                                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all font-medium ${fieldErrors.email ? 'border-red-500 bg-red-50/50' : 'border-slate-50 focus:border-indigo-500'
                                        }`}
                                />
                                {fieldErrors.email && (
                                    <p className="mt-1.5 text-xs text-red-600 font-semibold flex items-center gap-1.5 pl-1 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {fieldErrors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-slate-800 text-xs font-semibold uppercase tracking-widest pl-1">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-4 bg-slate-50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all font-medium ${fieldErrors.password ? 'border-red-500 bg-red-50/50' : 'border-slate-50 focus:border-indigo-500'
                                        }`}
                                />
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                {fieldErrors.password && (
                                    <p className="mt-1.5 text-xs text-red-600 font-semibold flex items-center gap-1.5 pl-1 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {fieldErrors.password}
                                    </p>
                                )}
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
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl transition-all font-semibold text-lg shadow-lg transform active:scale-[0.98] flex items-center justify-center gap-2 ${isLoading
                                ? 'bg-indigo-400 cursor-not-allowed text-white'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing Authenticity...
                                </>
                            ) : (
                                'Enter Portal'
                            )}
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

