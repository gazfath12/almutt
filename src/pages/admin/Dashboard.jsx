import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../components/auth/AuthProvider';
import AnimatedPage from '../../components/layout/AnimatedPage';
import { Users, Image as ImageIcon, BookOpen, LogOut, Settings } from 'lucide-react';

export default function Dashboard() {
    const { signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
    };

    const navItems = [
        { name: 'Member', icon: <Users size={20} />, path: '/admin/dashboard/members' },
        { name: 'Gallery', icon: <ImageIcon size={20} />, path: '/admin/dashboard/gallery' },
        { name: 'Kisah', icon: <BookOpen size={20} />, path: '/admin/dashboard/stories' },
    ];

    return (
        <AnimatedPage className="container pt-28 pb-12">
            <div className="flex flex-col lg:flex-row gap-8 min-h-[70vh]">
                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full lg:w-64 shrink-0 glass-panel p-6 flex flex-col h-full rounded-2xl relative overflow-hidden"
                >
                    {/* Removed heavy blur for performance */}

                    <div className="mb-8 border-b border-glass-border pb-6 flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-neon-blue/20 flex-center text-neon-blue border border-neon-blue/50">
                            <Settings size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-glow text-lg">Admin Panel</h2>
                            <p className="text-xs text-text-secondary">Web Almutt Gen 28</p>
                        </div>
                    </div>

                    <nav className="flex-grow space-y-2 relative z-10">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-all duration-300"
                            >
                                {item.icon}
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <button
                        onClick={handleSignOut}
                        className="mt-auto flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/30 relative z-10"
                    >
                        <LogOut size={18} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </motion.div>

                {/* Main Content Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-grow w-full glass-panel p-8 rounded-2xl relative overflow-hidden"
                >
                    {/* Removed heavy blur for performance */}

                    <div className="relative z-10">
                        <h1 className="text-3xl font-black mb-2">Selamat Datang, <span className="text-glow text-neon-blue">Admin</span></h1>
                        <p className="text-text-secondary mb-8">Kelola konten website dari control panel ini.</p>

                        <Outlet />

                        {/* If no nested route is matched, show default dashboard home */}
                        {window.location.pathname === '/admin/dashboard' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {navItems.map((item, i) => (
                                    <Link
                                        to={item.path}
                                        key={i}
                                        className="glass-panel p-6 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300 group"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-bg-darker/50 flex-center mb-4 group-hover:text-neon-purple transition-colors">
                                            {item.icon}
                                        </div>
                                        <h3 className="font-bold mb-1">Kelola {item.name}</h3>
                                        <p className="text-xs text-text-secondary">Tambah, Edit, Hapus {item.name}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatedPage>
    );
}
