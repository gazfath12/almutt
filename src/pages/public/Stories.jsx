import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedPage from '../../components/layout/AnimatedPage';
import { supabase } from '../../lib/supabase';

// Dummy fallback stories
const dummyStories = [
    {
        id: 's1',
        title: 'Awal Menginjakkan Kaki',
        content: 'MOS (Masa Orientasi Siswa) adalah momen pertama kita bertemu. Masih lugu, malu-malu, dan penuh rasa ingin tahu. Dimulai dari sini, kita saling mengenal satu sama lain.',
        grade_level: 1,
        image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'
    },
    {
        id: 's2',
        title: 'Mulai Terbiasa & Penuh Drama',
        content: 'Kelas 2 adalah masa di mana kekompakan kita mulai terbentuk. Organisasi, pensi, hingga drama kelas menjadi bumbu manis yang tidak akan pernah terlupa.',
        grade_level: 2,
        image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80'
    },
    {
        id: 's3',
        title: 'Menuju Puncak Bersama',
        content: 'Tahun terakhir penuh dengan perjuangan. Ujian demi ujian, perpisahan yang mengharu biru, mengajarkan kita arti persahabatan sejati.',
        grade_level: 3,
        image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80'
    }
];

export default function Kisah() {
    const [stories, setStories] = useState(dummyStories);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('stories')
                    .select('*')
                    .order('grade_level', { ascending: true });

                if (error) throw error;
                if (data && data.length > 0) {
                    setStories(data);
                }
            } catch (err) {
                console.error('Error fetching stories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    return (
        <AnimatedPage className="container">
            <div className="text-center mb-20 pt-32 relative">
                {/* Removed heavy blur element for performance */}
                <h1 className="text-4xl md:text-6xl font-black mb-4 relative z-10"><span className="text-glow text-neon-pink">Kisah</span> Perjalanan</h1>
                <p className="text-text-secondary max-w-2xl mx-auto">
                    Setiap jejak langkah dari hari pertama hingga momen kelulusan, terukir manis di timeline ini.
                </p>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 md:px-0">
                {/* Timeline Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-blue via-neon-purple to-neon-pink opacity-30 md:-translate-x-1/2 rounded-full hidden sm:block" />

                {/* Timeline Items */}
                <div className="space-y-24 pb-20">
                    {loading ? (
                        <div className="text-center py-20 text-text-secondary">Membuka lembaran masa lalu...</div>
                    ) : stories.length === 0 ? (
                        <div className="text-center py-20 text-text-secondary glass-panel">Belum ada cerita perjalanan yang dituliskan.</div>
                    ) : (
                        stories.map((story, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div
                                    key={story.id}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    variants={{
                                        hidden: { opacity: 0, y: 50 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                                    }}
                                    className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 relative ${isEven ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* Timeline Dot */}
                                    <div className="hidden sm:flex absolute left-4 md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-bg-dark border-4 border-neon-blue items-center justify-center z-10 shadow-[0_0_15px_rgba(0,243,255,0.8)]">
                                        <div className="w-2 h-2 rounded-full bg-neon-pink" />
                                    </div>

                                    {/* Content Card */}
                                    <div className={`w-full md:w-1/2 ${isEven ? 'md:text-right' : 'md:text-left'} ml-12 sm:ml-0`}>
                                        <div className="glass-panel p-8 relative group overflow-hidden hover:scale-105 transition-transform duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            <span className="inline-block px-3 py-1 bg-neon-purple/20 text-neon-purple text-sm font-bold rounded-full mb-4 border border-neon-purple/50">
                                                Kelas {story.grade_level}
                                            </span>

                                            <h2 className="text-2xl font-bold mb-4 text-glow group-hover:text-neon-pink transition-colors">
                                                {story.title}
                                            </h2>

                                            <p className="text-text-secondary leading-relaxed mb-6 whitespace-pre-line">
                                                {story.content}
                                            </p>

                                            {story.image_url && (
                                                <div className="relative w-full aspect-video rounded-xl overflow-hidden filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-500">
                                                    <img
                                                        src={story.image_url}
                                                        alt={story.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
}
