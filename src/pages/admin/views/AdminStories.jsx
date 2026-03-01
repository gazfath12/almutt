import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Edit, Trash2, X, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminStories() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStory, setCurrentStory] = useState(null);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [gradeLevel, setGradeLevel] = useState(1);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('stories')
                .select('*')
                .order('grade_level', { ascending: true });

            if (error) throw error;
            setStories(data || []);
        } catch (err) {
            console.error('Error fetching stories:', err);
            setStories([]);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (story = null) => {
        setCurrentStory(story);
        setTitle(story ? story.title : '');
        setContent(story ? story.content : '');
        setGradeLevel(story ? story.grade_level : 1);
        setPhotoFile(null);
        setPhotoPreview(story ? story.image_url : '');
        setMessage('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentStory(null);
        setMessage('');
    };

    const uploadPhoto = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `stories/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('uploads')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('uploads')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            let finalPhotoUrl = currentStory ? currentStory.image_url : null;

            if (photoFile) {
                finalPhotoUrl = await uploadPhoto(photoFile);
            }

            const storyData = {
                title,
                content,
                grade_level: parseInt(gradeLevel),
                image_url: finalPhotoUrl
            };

            if (currentStory) {
                // Update
                const { error } = await supabase
                    .from('stories')
                    .update(storyData)
                    .eq('id', currentStory.id);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Cerita berhasil diupdate!' });
            } else {
                // Create
                const { error } = await supabase
                    .from('stories')
                    .insert([storyData]);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Cerita berhasil ditambahkan!' });
            }

            fetchStories();
            setTimeout(closeModal, 1500);
        } catch (err) {
            console.error('Error saving story:', err);
            setMessage({ type: 'error', text: err.message || 'Gagal menyimpan cerita.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus cerita di timeline ini?')) return;

        try {
            const { error } = await supabase
                .from('stories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchStories();
        } catch (err) {
            console.error('Error deleting story:', err);
            alert('Gagal menghapus cerita.');
        }
    };

    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Kelola Kisah (Timeline)</h2>
                <button
                    onClick={() => openModal()}
                    className="btn btn-primary flex items-center gap-2 text-sm py-2"
                >
                    <Plus size={18} /> Tambah Cerita
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            {/* List format since stories are few but content-heavy */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-text-secondary">Memuat data timeline...</div>
                ) : stories.length === 0 ? (
                    <div className="text-center py-10 text-text-secondary glass-panel border border-dashed border-glass-border">
                        Belum ada cerita perjalanan angkatan.
                    </div>
                ) : (
                    stories.map(story => (
                        <div key={story.id} className="glass-panel p-6 flex flex-col md:flex-row gap-6 border border-glass-border">
                            {/* Image Preview Thumbnail */}
                            <div className="w-full md:w-48 h-32 rounded-lg bg-bg-darker overflow-hidden shrink-0 border border-glass-border">
                                {story.image_url ? (
                                    <img src={story.image_url} alt={story.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-text-secondary">No Image</div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-neon-pink/20 text-neon-pink text-xs font-bold rounded mb-2 border border-neon-pink/50">
                                            Kelas {story.grade_level}
                                        </span>
                                        <h3 className="text-xl font-bold">{story.title}</h3>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(story)}
                                            className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(story.id)}
                                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-text-secondary text-sm line-clamp-3 mt-2">
                                    {story.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-bg-darker/90 backdrop-blur-sm overflow-y-auto">
                    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
                        <div className="glass-panel w-full max-w-2xl p-6 relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-text-secondary hover:text-neon-pink"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-xl font-bold mb-6 text-glow">
                                {currentStory ? 'Edit Cerita' : 'Tambah Cerita Angkatan'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Left Col: Image */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-text-secondary">Foto Kenangan (Opsional)</label>
                                        <div className="w-full aspect-video rounded-xl border-2 border-dashed border-glass-border relative overflow-hidden flex flex-col items-center justify-center bg-bg-darker/50 group">
                                            {photoPreview ? (
                                                <>
                                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="font-medium flex items-center gap-2"><UploadCloud size={16} /> Ganti Foto</span>
                                                        <input type="file" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <UploadCloud size={32} className="text-text-secondary mb-2" />
                                                    <span className="text-xs text-text-secondary">Klik untuk memilih</span>
                                                    <input type="file" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Col: Basic Info */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-text-secondary">Tingkat Kelas</label>
                                            <select
                                                value={gradeLevel}
                                                onChange={(e) => setGradeLevel(e.target.value)}
                                                className="w-full bg-bg-darker border border-glass-border text-white rounded-lg p-3 outline-none focus:border-neon-pink transition-colors appearance-none"
                                            >
                                                <option value={1}>Kelas 1 (Awal Masuk / Kelas 7)</option>
                                                <option value={2}>Kelas 2 (Pertengahan / Kelas 8)</option>
                                                <option value={3}>Kelas 3 (Akhir / Kelas 9)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-text-secondary">Judul Cerita</label>
                                            <input
                                                type="text"
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Masa Orientasi: Awal Pertemuan"
                                                className="w-full bg-bg-darker/80 border border-glass-border rounded-lg p-3 focus:border-neon-pink outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Full Width: Content */}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-text-secondary">Isi Cerita</label>
                                    <textarea
                                        rows="5"
                                        required
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Ceritakan kejadian paling berkesan..."
                                        className="w-full bg-bg-darker/80 border border-glass-border rounded-lg p-3 focus:border-neon-pink outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-glass-border mt-6">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded-lg bg-transparent border border-glass-border hover:bg-white/5 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="btn btn-primary px-6 py-2 rounded-lg text-sm bg-gradient-to-r from-neon-purple to-neon-pink"
                                    >
                                        {saving ? 'Menyimpan...' : 'Simpan Cerita'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
