import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Trash2, X, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminGallery() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');

    // Form State
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState('kelas1'); // Default fallback

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPhotos(data || []);
        } catch (err) {
            console.error('Error fetching gallery:', err);
            // Don't show confusing error banner if it's just empty/RLS issue during dev, let it show "Belum ada foto"
            setPhotos([]);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setPhotoFile(null);
        setPhotoPreview('');
        setCaption('');
        setCategory('kelas1');
        setIsModalOpen(true);
    };

    const uploadPhoto = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

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
        if (!photoFile) {
            alert("Pilih foto terlebih dahulu!");
            return;
        }

        setSaving(true);
        setMessage('');

        try {
            const photoUrl = await uploadPhoto(photoFile);

            const { error } = await supabase
                .from('gallery')
                .insert([{ image_url: photoUrl, caption, category }]);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Foto berhasil ditambahkan ke galeri.' });
            fetchPhotos();
            setTimeout(() => {
                setIsModalOpen(false);
                setMessage('');
            }, 1500);

        } catch (err) {
            console.error('Error saving photo:', err);
            setMessage({ type: 'error', text: err.message || 'Gagal menyimpan foto' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus foto dari galeri?')) return;

        try {
            const { error } = await supabase
                .from('gallery')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchPhotos();
        } catch (err) {
            console.error('Error deleting photo:', err);
            alert('Gagal menghapus foto.');
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
                <h2 className="text-2xl font-bold">Kelola Gallery</h2>
                <button
                    onClick={openModal}
                    className="btn btn-primary flex items-center gap-2 text-sm py-2"
                >
                    <Plus size={18} /> Upload Foto Baru
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            {/* Grid Layout for Gallery Admin */}
            {loading ? (
                <div className="text-center py-20 text-text-secondary">Memuat foto...</div>
            ) : photos.length === 0 ? (
                <div className="text-center py-20 text-text-secondary glass-panel border border-dashed border-glass-border">
                    Belum ada foto yang diupload.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map(photo => (
                        <div key={photo.id} className="glass-panel p-2 relative group rounded-xl overflow-hidden aspect-square border border-glass-border">
                            <img src={photo.image_url} alt="Gallery item" className="w-full h-full object-cover rounded-lg" />

                            <div className="absolute inset-0 bg-bg-darker/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                <span className="text-xs bg-neon-purple/20 text-neon-purple rounded-full px-2 py-1 mb-2 border border-neon-purple/50">
                                    {photo.category}
                                </span>
                                <p className="text-sm font-medium text-center line-clamp-2 mb-4">{photo.caption}</p>

                                <button
                                    onClick={() => handleDelete(photo.id)}
                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/30"
                                >
                                    <Trash2 size={16} /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-bg-darker/90 backdrop-blur-sm overflow-y-auto">
                    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
                        <div className="glass-panel w-full max-w-lg p-6 relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-text-secondary hover:text-neon-pink"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-xl font-bold mb-6 text-glow">Upload Ke Gallery</h3>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Image Preview / Upload Area */}
                                <div className="w-full aspect-video rounded-xl border-2 border-dashed border-glass-border relative overflow-hidden flex flex-col items-center justify-center bg-bg-darker/50 group hover:border-neon-blue transition-colors">
                                    {photoPreview ? (
                                        <>
                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="font-medium flex items-center gap-2"><UploadCloud size={20} /> Ganti Foto</span>
                                                <input type="file" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud size={48} className="text-text-secondary mb-2 group-hover:text-neon-blue transition-colors" />
                                            <span className="text-sm text-text-secondary">Klik untuk memilih gambar</span>
                                            <input type="file" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                        </>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-text-secondary">Kategori (Event)</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-bg-darker border border-glass-border text-white rounded-lg p-3 outline-none focus:border-neon-blue transition-colors appearance-none"
                                    >
                                        <option value="kelas1">Kelas 1</option>
                                        <option value="kelas2">Kelas 2</option>
                                        <option value="kelas3">Kelas 3</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-text-secondary">Caption / Keterangan</label>
                                    <textarea
                                        rows="2"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        placeholder="Misal: Keseruan classmeet semester ganjil."
                                        className="w-full bg-bg-darker/80 border border-glass-border rounded-lg p-3 focus:border-neon-blue outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-glass-border mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-lg bg-transparent border border-glass-border hover:bg-white/5 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving || !photoFile}
                                        className="btn btn-primary px-6 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? 'Mengupload...' : 'Upload Foto'}
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
