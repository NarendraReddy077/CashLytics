import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
    const { signIn, signUp } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);
        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                await signUp(email, password);
                setSuccessMsg('Account created! Check your email to confirm, then log in.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/20 blur-[120px]" />

            <div className="w-full max-w-md glass rounded-3xl p-8 shadow-2xl animate-slide-up relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 premium-gradient shadow-lg animate-pulse-glow">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-orange-600 flex items-center justify-center">
                            <span className="text-yellow-400 text-3xl font-bold">₹</span>
                        </div>
                    </div>
                    <h1 className="text-xl lg:text-2xl font-black tracking-tighter leading-none" style={{ color: 'var(--color-text)' }}>
                        Cash<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-orange-500">Lytics</span>
                    </h1>
                    <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
                    </p>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl text-sm border border-red-500/20 text-red-300 bg-red-500/10 animate-fade-in">
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="mb-6 p-4 rounded-xl text-sm border border-emerald-500/20 text-emerald-300 bg-emerald-500/10 animate-fade-in">
                        {successMsg}
                    </div>
                )}

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold ml-1 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Email Address</label>
                        <input
                            id="auth-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 bg-slate-900/50 border border-slate-700/50 focus:border-indigo-500/50"
                            style={{ color: 'var(--color-text)' }}
                            placeholder="user@gmail.com"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold ml-1 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Password</label>
                        <input
                            id="auth-password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 bg-slate-900/50 border border-slate-700/50 focus:border-indigo-500/50"
                            style={{ color: 'var(--color-text)' }}
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>
                    <button
                        id="auth-submit"
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl text-sm font-bold text-white transition-all duration-300 bg-gradient-to-br from-indigo-600 via-purple-600 to-orange-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.45)] disabled:opacity-50 active:scale-[0.98] transform"
                    >
                        {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {/* Toggle Footer */}
                <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                            id="auth-toggle"
                            type="button"
                            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
                            className="font-bold text-orange-600 hover:text-orange-500 transition-colors cursor-pointer ml-1"
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
