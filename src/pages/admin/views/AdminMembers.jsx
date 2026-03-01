import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Edit, Trash2, X, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);

    // Form State
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [instagram, setInstagram] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');

    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMembers(data || []);
        } catch (err) {
            console.error('Error fetching members:', err);
            setMessage({ type: 'error', text: 'Gagal mengambil data member' });
        } finally {
            setLoading(false);
        }
    };

    const openModal = (member = null) => {
        setCurrentMember(member);
        setName(member ? member.name : '');
        setBio(member ? member.bio : '');
        setInstagram(member ? member.instagram : '');
        setPhotoFile(null);
        setPhotoPreview(member ? member.photo_url : '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentMember(null);
        setMessage('');
    };

    const uploadPhoto = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `members/${fileName}`;

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
            let finalPhotoUrl = currentMember ? currentMember.photo_url : '';

            if (photoFile) {
                finalPhotoUrl = await uploadPhoto(photoFile);
            }

            const memberData = {
                name,
                bio,
                instagram,
                photo_url: finalPhotoUrl
            };

            if (currentMember) {
                // Update
                const { error } = await supabase
                    .from('members')
                    .update(memberData)
                    .eq('id', currentMember.id);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Member berhasil diupdate' });
            } else {
                // Create
                const { error } = await supabase
                    .from('members')
                    .insert([memberData]);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Member berhasil ditambahkan' });
            }

            fetchMembers();
            setTimeout(closeModal, 1500);
        } catch (err) {
            console.error('Error saving member:', err);
            setMessage({ type: 'error', text: err.message || 'Gagal menyimpan member' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus member ini?')) return;

        try {
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchMembers();
        } catch (err) {
            console.error('Error deleting member:', err);
            alert('Gagal menghapus member');
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
                <h2 className="text-2xl font-bold">Kelola Data Member</h2>
                <button
                    onClick={() => openModal()}
                    className="btn btn-primary flex items-center gap-2 text-sm py-2"
                >
                    <Plus size={18} /> Tambah Member
                </button>
            </div>

            {/* Loading & Messages */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-glass-border">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-bg-darker/50">
                            <th className="p-4 border-b border-glass-border font-medium text-text-secondary">Foto</th>
                            <th className="p-4 border-b border-glass-border font-medium text-text-secondary">Nama</th>
                            <th className="p-4 border-b border-glass-border font-medium text-text-secondary">Instagram</th>
                            <th className="p-4 border-b border-glass-border font-medium text-text-secondary text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-text-secondary">Memuat data...</td>
                            </tr>
                        ) : members.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-text-secondary">Belum ada member. Silakan tambah baru.</td>
                            </tr>
                        ) : (
                            members.map(member => (
                                <tr key={member.id} className="hover:bg-white/5 transition-colors border-b border-glass-border/50 last:border-0">
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-bg-darker border border-glass-border">
                                            {member.photo_url ? (
                                                <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">No img</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">{member.name}</td>
                                    <td className="p-4 text-text-secondary">{member.instagram}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openModal(member)}
                                                className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors border border-blue-500/30"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/30"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal / Dialog Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-bg-darker/90 backdrop-blur-sm overflow-y-auto">
                    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
                        <div className="glass-panel w-full max-w-lg p-6 relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-text-secondary hover:text-neon-pink"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-xl font-bold mb-6 text-glow">
                                {currentMember ? 'Edit Member' : 'Tambah Member Baru'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Photo Upload */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-glass-border mb-3 relative overflow-hidden group flex items-center justify-center bg-bg-darker/50">
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <PlusCircle className="text-text-secondary" size={32} />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                            <span className="text-sm font-medium">Pilih Foto</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-secondary">Format: .jpg, .png</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-text-secondary">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-bg-darker/80 border border-glass-border rounded-lg p-3 focus:border-neon-blue outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-text-secondary">Biodata (Quotes/Hobi/Cita-cita)</label>
                                    <textarea
                                        rows="3"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full bg-bg-darker/80 border border-glass-border rounded-lg p-3 focus:border-neon-blue outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-text-secondary">Instagram</label>
                                    <input
                                        type="text"
                                        value={instagram}
                                        onChange={(e) => setInstagram(e.target.value)}
                                        placeholder="@username"
                                        className="w-full bg-bg-darker/80 border border-glass-border rounded-lg p-3 focus:border-neon-blue outline-none transition-colors"
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
                                        className="btn btn-primary px-6 py-2 rounded-lg text-sm"
                                    >
                                        {saving ? 'Menyimpan...' : 'Simpan'}
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
