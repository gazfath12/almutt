import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Image as ImageIcon, BookOpen, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../../components/layout/AnimatedPage';
import { supabase } from '../../lib/supabase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import heroImage1 from '../../assets/hero1.png'; 
import heroImage2 from '../../assets/hero2.png'; 
import heroImage3 from '../../assets/hero3.png'; 
import heroImage4 from '../../assets/hero-4.png';
import heroImage5 from '../../assets/hero-5.jpeg';
import heroImage6 from '../../assets/hero-6.jpeg';
import heroImage7 from '../../assets/hero-7.jpeg';

// const heroImage1 = require('./assets/nama.img/image1.jpg');



// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

// Placeholder data for preview
const dummyPreviewMembers = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    name: `Siswa ${i + 1}`,
    role: 'Member',
    photo_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=bc13fe,00f3ff`
}));

const heroImages = [
    heroImage1,
    heroImage2,
    heroImage3,
    heroImage4,
    heroImage5,
    heroImage6,
    heroImage7
];

const features = [
    {
        title: "Gallery Kenangan",
        desc: "Kumpulan foto perjalanan kita dari kelas 1 hingga lulus.",
        icon: <ImageIcon className="w-8 h-8 text-neon-blue" />,
        link: "/gallery"
    },
    {
        title: "Daftar Member",
        desc: "Profil lengkap 28 siswa angkatan dengan biodata.",
        icon: <Users className="w-8 h-8 text-neon-purple" />,
        link: "/member"
    },
    {
        title: "Kisah Angkatan",
        desc: "Timeline cerita suka duka selama masa sekolah.",
        icon: <BookOpen className="w-8 h-8 text-neon-pink" />,
        link: "/kisah"
    }
];

export default function Home() {
    const [previewMembers, setPreviewMembers] = useState(dummyPreviewMembers);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreviewMembers = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('members')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(8);

                if (error) throw error;
                // Use dummy data if database is empty to keep design visible
                if (data && data.length > 0) {
                    setPreviewMembers(data);
                }
            } catch (err) {
                console.error('Error fetching preview members:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPreviewMembers();
    }, []);

    return (
        <AnimatedPage>
            {/* Hero Section with Swiper */}
            <section className="relative h-[85vh] w-full overflow-hidden">
                <Swiper
                    modules={[Autoplay, EffectFade, Pagination]}
                    effect="fade"
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    loop={true}
                    className="h-full w-full"
                >
                    {heroImages.map((img, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative h-full w-full">
                                <img
                                    src={img}
                                    alt={`Hero ${index + 1}`}
                                    className="h-full w-full object-cover brightness-[0.8] contrast-[1.1]"
                                />
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Hero Content Over Swiper */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, type: "spring" }}
                        className="mb-6 relative"
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-2 tracking-tighter drop-shadow-2xl">
                             <span className="text-gradient">The Beneficiares</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-text-primary/90 font-display font-medium tracking-wide uppercase mt-4 drop-shadow-lg">
                            Bukan Sekedar Angkatan, Kita Adalah Teman.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex flex-wrap justify-center gap-4 mt-8"
                    >
                        <Link to="/gallery" className="btn btn-primary px-8">
                            Lihat Gallery <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link to="/member" className="btn btn-outline px-8 backdrop-blur-md">
                            Daftar Member
                        </Link>
                    </motion.div>
                </div>

                {/* Decorative bottom fade */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-bg-dark to-transparent z-10" />
            </section>

            {/* Features Grid */}
            <section className="py-20 container relative">
                {/* Removed heavy blur for performance */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                        >
                            <Link to={feature.link} className="block glass-panel p-8 h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] group">
                                <div className="bg-bg-darker/50 w-16 h-16 rounded-2xl flex-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl mb-3 font-bold group-hover:text-neon-blue transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-text-secondary">
                                    {feature.desc}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Member Preview */}
            <section className="py-20 container">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl mb-4"
                    >
                        Anggota <span className="text-glow text-neon-purple">Keluarga</span>
                    </motion.h2>
                    <p className="text-text-secondary">28 Cerita, 1 Tujuan.</p>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-text-secondary">Memuat data pahlawan...</div>
                ) : previewMembers.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {previewMembers.map((member, idx) => (
                            <motion.div
                                key={member.id}
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-panel p-4 text-center group"
                            >
                                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-bg-darker flex items-center justify-center">
                                    {member.photo_url ? (
                                        <img
                                            src={member.photo_url}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <UserCircle className="w-16 h-16 text-text-secondary opacity-50" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-darker via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h4 className="font-bold text-lg group-hover:text-neon-blue transition-colors line-clamp-1">{member.name}</h4>
                                <p className="text-sm text-text-secondary line-clamp-1">{member.instagram || "Member"}</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 glass-panel">
                        <p className="text-text-secondary">Belum ada member yang terdaftar.</p>
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link to="/member" className="btn btn-outline">Lihat Semua 28 Siswa</Link>
                </div>
            </section>
        </AnimatedPage>
    );
}
