import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../components/auth/AuthProvider';
import AnimatedPage from '../../components/layout/AnimatedPage';
import { Lock, Mail, AlertCircle, UserPlus } from 'lucide-react';

export default function Login() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg('');

        try {
            if (isLoginMode) {
                const { error } = await signIn({ email, password });
                if (error) throw error;
                navigate('/admin/dashboard');
            } else {
                const { error } = await signUp({ email, password });
                if (error) throw error;
                setSuccessMsg('Akun berhasil dibuat! Silakan buka dashboard atau tunggu verifikasi.');
                // Usually Supabase requires email verification, but we'll try to login right away if auto-confirm is enabled
                setTimeout(() => navigate('/admin/dashboard'), 2000);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedPage className="container flex-center min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="glass-panel p-8 w-full max-w-md relative overflow-hidden"
            >
                {/* Removed heavy blur for performance */}

                <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-bg-darker rounded-full flex-center mx-auto mb-4 border border-glass-border">
                        {isLoginMode ? <Lock className="text-neon-blue" size={32} /> : <UserPlus className="text-neon-purple" size={32} />}
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Admin {isLoginMode ? 'Login' : 'Register'}</h1>
                    <p className="text-text-secondary text-sm">
                        {isLoginMode ? 'Masuk untuk mengelola konten website.' : 'Buat akun admin baru.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex items-start gap-3 text-red-400 relative z-10">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {successMsg && (
                    <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/50 flex items-start gap-3 text-green-400 relative z-10">
                        <p className="text-sm">{successMsg}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-text-secondary">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-bg-darker/50 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue transition-colors placeholder-text-secondary/50"
                                placeholder="admin@almutt.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-text-secondary">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-bg-darker/50 border border-glass-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-purple transition-colors placeholder-text-secondary/50"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn btn-primary flex-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isLoginMode ? 'Masuk ke Dashboard' : 'Buat Akun')}
                    </button>

                    <button
                        type="button"
                        onClick={() => { setIsLoginMode(!isLoginMode); setError(null); }}
                        className="w-full text-sm text-text-secondary hover:text-white transition-colors mt-4"
                    >
                        {isLoginMode ? 'Belum punya akun? Daftar disini' : 'Sudah punya akun? Masuk disini'}
                    </button>
                </form>
            </motion.div>
        </AnimatedPage>
    );
}
