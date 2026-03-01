import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import AnimatedPage from '../../components/layout/AnimatedPage';
import { supabase } from '../../lib/supabase';

const categories = [
    { id: 'all', label: 'Semua Kenangan' },
    { id: 'kelas1', label: 'Kelas 1' },
    { id: 'kelas2', label: 'Kelas 2' },
    { id: 'kelas3', label: 'Kelas 3' }
];

// Dummy fallback data
const dummyGallery = [
    { id: '1', image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', caption: 'Masa Orientasi Siswa', category: 'kelas1' },
    { id: '2', image_url: 'https://images.unsplash.com/photo-1510531704581-5b2870972060?w=800&q=80', caption: 'Pensi Sekolah', category: 'kelas2' },
    { id: '3', image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', caption: 'Study Tour Jakarta', category: 'kelas2' },
    { id: '4', image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', caption: 'Ujian Praktek Terakhir', category: 'kelas3' },
    { id: '5', image_url: 'https://images.unsplash.com/photo-1546215364-12f3fff5d578?w=800&q=80', caption: 'Kelulusan', category: 'kelas3' },
];

export default function Gallery() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);
    const [gallery, setGallery] = useState(dummyGallery);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('gallery')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data && data.length > 0) {
                    setGallery(data);
                }
            } catch (err) {
                console.error('Error fetching gallery:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    const filteredGallery = activeCategory === 'all'
        ? gallery
        : gallery.filter(item => item.category === activeCategory);

    return (
        <AnimatedPage className="container">
            <div className="text-center mb-12 pt-32 pb-4">
                <h1 className="text-4xl md:text-6xl font-black mb-4"><span className="text-glow text-neon-blue">Gallery</span> Kenangan</h1>
                <p className="text-text-secondary max-w-2xl mx-auto">
                    Setiap gambar menangkap ribuan momen tak terlupakan selama 3 tahun masa sekolah.
                </p>
            </div>

            {/* Filter Options */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <div className="flex items-center gap-2 text-text-secondary mr-4">
                    <Filter size={20} />
                    <span>Filter:</span>
                </div>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${activeCategory === cat.id
                            ? 'bg-neon-blue text-bg-darker shadow-[0_0_15px_rgba(0,243,255,0.5)]'
                            : 'glass-panel hover:text-neon-blue'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Masonry/Grid Layout */}
            {loading ? (
                <div className="text-center py-20 text-text-secondary">Memuat galeri...</div>
            ) : filteredGallery.length > 0 ? (
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {filteredGallery.map((item, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                key={item.id}
                                className="glass-panel p-2 cursor-pointer group rounded-xl overflow-hidden aspect-[4/5]"
                                onClick={() => setSelectedImage(item)}
                            >
                                <div className="relative w-full h-full rounded-lg overflow-hidden">
                                    <img
                                        src={item.image_url}
                                        alt={item.caption}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-darker/90 via-bg-darker/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <p className="font-medium text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {item.caption}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="text-center py-20 text-text-secondary glass-panel">
                    Belum ada foto kenangan.
                </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex-center bg-bg-darker/95 backdrop-blur-md p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-text-secondary hover:text-neon-pink p-2 transition-colors z-[101]"
                            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                        >
                            <X size={32} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="max-w-5xl w-full max-h-[80vh] relative flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.image_url}
                                alt={selectedImage.caption}
                                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.2)]"
                            />
                            <p className="mt-6 text-xl text-center glass-panel px-6 py-3">
                                {selectedImage.caption}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AnimatedPage>
    );
}
