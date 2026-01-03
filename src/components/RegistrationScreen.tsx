import { useState } from 'react';
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type RegistrationScreenProps = {
    onSwitchToLogin: () => void;
};

export function RegistrationScreen({ onSwitchToLogin }: RegistrationScreenProps) {
    const { login } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        let hasError = false;
        if (!name) {
            setFieldErrors(prev => ({ ...prev, name: 'Full name required' }));
            hasError = true;
        }
        if (!email) {
            setFieldErrors(prev => ({ ...prev, email: 'Email address required' }));
            hasError = true;
        } else if (!email.includes('@')) {
            setFieldErrors(prev => ({ ...prev, email: 'Enter a valid university email' }));
            hasError = true;
        }
        if (!password) {
            setFieldErrors(prev => ({ ...prev, password: 'Security code required' }));
            hasError = true;
        } else if (password.length < 6) {
            setFieldErrors(prev => ({ ...prev, password: 'Minimum 6 characters' }));
            hasError = true;
        }
        if (password !== confirmPassword) {
            setFieldErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match, please confirm your password' }));
            hasError = true;
        }

        if (hasError) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (data.error) {
                if (data.error.toLowerCase().includes('email')) {
                    setFieldErrors({ email: data.error });
                } else {
                    setError(data.error);
                }
                return;
            }

            login(data.user, data.token);
            router.push('/');
        } catch (err: any) {
            setError('Identity registration failed. Check network connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-xl shadow-indigo-100 transform rotate-3 overflow-hidden">
                        <img src="/logo.png" alt="VoteFlow Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-slate-900 mb-2 font-semibold text-2xl tracking-tight">VoteFlow</h1>
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
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all font-medium text-sm ${fieldErrors.name ? 'border-red-500 bg-red-50/50' : 'border-slate-50 focus:border-indigo-500'
                                        }`}
                                />
                                {fieldErrors.name && (
                                    <p className="mt-1 text-[10px] text-red-600 font-bold flex items-center gap-1 pl-1 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {fieldErrors.name}
                                    </p>
                                )}
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
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all font-medium text-sm ${fieldErrors.email ? 'border-red-500 bg-red-50/50' : 'border-slate-50 focus:border-indigo-500'
                                        }`}
                                />
                                {fieldErrors.email && (
                                    <p className="mt-1 text-[10px] text-red-600 font-bold flex items-center gap-1 pl-1 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {fieldErrors.email}
                                    </p>
                                )}
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
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full pl-10 pr-10 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all font-medium text-sm ${fieldErrors.password ? 'border-red-500 bg-red-50/50' : 'border-slate-50 focus:border-indigo-500'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    {fieldErrors.password && (
                                        <p className="mt-1 text-[10px] text-red-600 font-bold flex items-center gap-1 pl-1 animate-in fade-in slide-in-from-top-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {fieldErrors.password}
                                        </p>
                                    )}
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
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full pl-10 pr-10 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all font-medium text-sm ${fieldErrors.confirmPassword ? 'border-red-500 bg-red-50/50' : 'border-slate-50 focus:border-indigo-500'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    {fieldErrors.confirmPassword && (
                                        <p className="mt-1 text-[10px] text-red-600 font-bold flex items-center gap-1 pl-1 animate-in fade-in slide-in-from-top-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {fieldErrors.confirmPassword}
                                        </p>
                                    )}
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
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl transition-all font-semibold text-lg shadow-lg transform active:scale-[0.98] flex items-center justify-center gap-2 ${isLoading
                                ? 'bg-indigo-400 cursor-not-allowed text-white'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Finalizing Registration...
                                </>
                            ) : (
                                'Create Identity'
                            )}
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

