import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Instagram, UserCircle } from 'lucide-react';
import AnimatedPage from '../../components/layout/AnimatedPage';
import { supabase } from '../../lib/supabase';

// Dummy fallback data
const dummyMembers = Array.from({ length: 28 }).map((_, i) => ({
    id: `dummy-${i}`,
    name: `Siswa Ke-${i + 1} Almutt`,
    bio: i % 2 === 0 ? "Mengejar mimpi setinggi langit, seluas galaxy." : "Tetap chill walaupun tugas numpuk.",
    instagram: "@siswa_" + (i + 1),
    photo_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}&backgroundColor=bc13fe,00f3ff,1e1e1e`
}));

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.5,
            type: "spring",
        },
    }),
};

export default function Members() {
    const [searchTerm, setSearchTerm] = useState('');
    const [members, setMembers] = useState(dummyMembers);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('members')
                    .select('*')
                    .order('name', { ascending: true });

                if (error) throw error;
                // Fallback to dummy if empty
                if (data && data.length > 0) {
                    setMembers(data);
                }
            } catch (err) {
                console.error('Error fetching members:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.bio && member.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AnimatedPage className="container">
            <div className="text-center mb-16 pt-32 relative">
                {/* Removed heavy blur element for performance */}
                <h1 className="text-4xl md:text-6xl font-black mb-4 relative z-10">Keluarga <span className="text-glow text-neon-purple">Gen 28</span></h1>
                <p className="text-text-secondary text-lg">Daftar lengkap pahlawan kita.</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-16 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative glass-panel rounded-xl flex items-center px-4 py-3 bg-bg-darker/80">
                    <Search className="text-neon-blue mr-3" size={24} />
                    <input
                        type="text"
                        placeholder="Cari nama atau biodata..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-lg placeholder-text-secondary/50 font-display"
                    />
                </div>
            </div>

            {/* Members Grid */}
            {loading ? (
                <div className="text-center py-20 text-text-secondary">Memuat data clan...</div>
            ) : filteredMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredMembers.map((member, i) => (
                        <motion.div
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            key={member.id}
                            className="glass-panel p-6 flex flex-col items-center text-center group hover:bg-white/[0.05] transition-colors relative overflow-hidden"
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.1)_0%,transparent_70%)] pointer-events-none" />

                            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-neon-blue to-neon-purple mb-6 relative z-10 group-hover:scale-105 transition-transform duration-300">
                                <div className="w-full h-full rounded-full overflow-hidden bg-bg-darker">
                                    {member.photo_url ? (
                                        <img
                                            src={member.photo_url}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserCircle className="w-full h-full text-text-secondary opacity-50 p-4" />
                                    )}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-neon-blue transition-colors z-10">
                                {member.name}
                            </h3>

                            <p className="text-sm text-text-secondary mb-6 flex-grow z-10 line-clamp-3 italic">
                                {member.bio ? `"${member.bio}"` : ""}
                            </p>

                            {member.instagram && (
                                <a
                                    href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-sm text-neon-pink hover:text-white transition-colors z-10 p-2 rounded-lg hover:bg-neon-pink/20"
                                >
                                    <Instagram size={18} />
                                    {member.instagram}
                                </a>
                            )}
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 text-text-secondary flex flex-col items-center"
                >
                    <UserCircle size={64} className="mb-4 opacity-30" />
                    <p className="text-xl">Tidak ada member yang cocok dengan pencarianmu.</p>
                </motion.div>
            )}
        </AnimatedPage>
    );
}
