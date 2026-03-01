import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Member', path: '/member' },
    { name: 'Kisah', path: '/kisah' }
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'
                }`}
        >
            <div className="container pt-4">
                <div className={`px-8 py-4 flex items-center justify-between rounded-2xl ${isScrolled ? 'bg-bg-darker/95 backdrop-blur-md border border-glass-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent'
                    } transition-all duration-300`}>

                    {/* Logo */}
                    <Link to="/" className="text-2xl font-display font-bold text-gradient flex items-center gap-2">
                        <span className="text-glow">ALMUTT</span>
                        <span className="text-sm px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/50">
                            Gen 28
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `font-medium transition-colors hover:text-neon-blue relative group ${isActive ? 'text-neon-blue' : 'text-text-secondary'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {link.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-indicator"
                                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-50" />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-text-primary hover:text-neon-blue transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 z-[60] bg-bg-darker border-l border-glass-border shadow-2xl flex flex-col justify-center items-center"
                    >
                        <button
                            className="absolute top-6 right-6 p-2 text-text-secondary hover:text-white transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <X size={32} />
                        </button>

                        <div className="flex flex-col items-center gap-8 text-2xl font-display font-medium">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `transition-colors hover:text-neon-blue ${isActive ? 'text-neon-blue' : 'text-text-secondary hover:text-white'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
