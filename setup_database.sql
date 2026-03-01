-- 1. Buat Tabel Members (Bila belum ada)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT,
    instagram TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Buat Tabel Gallery (Bila belum ada)
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    category TEXT NOT NULL CHECK (category IN ('kelas1', 'kelas2', 'kelas3')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Buat Tabel Stories (Kisah) (Bila belum ada)
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    grade_level INTEGER NOT NULL CHECK (grade_level IN (1, 2, 3)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hapus kebijakan (policies) lama agar tidak bentrok atau ganda
DROP POLICY IF EXISTS "Public read access for members" ON public.members;
DROP POLICY IF EXISTS "Public read access for gallery" ON public.gallery;
DROP POLICY IF EXISTS "Public read access for stories" ON public.stories;
DROP POLICY IF EXISTS "Admin write access for members" ON public.members;
DROP POLICY IF EXISTS "Admin write access for gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin write access for stories" ON public.stories;

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Berikan akses BACA (READ) untuk semua orang (publik)
CREATE POLICY "Public read access for members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Public read access for gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public read access for stories" ON public.stories FOR SELECT USING (true);

-- Berikan akses TULIS (INSERT, UPDATE, DELETE) untuk admin (authenticated)
-- PERBAIKAN: DITAMBAHKAN WITH CHECK (true) AGAR PROSES INSERT DIIZINKAN
CREATE POLICY "Admin write access for members" ON public.members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write access for gallery" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write access for stories" ON public.stories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- SCRIPT STORAGE (STORAGE BUCKET & POLICIES)
-- ==========================================
-- Coba insert bucket "uploads" jika belum ada
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true) ON CONFLICT (id) DO UPDATE SET public = true;

-- Hapus policy storage lama agar bersih
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access" ON storage.objects;

-- Berikan akses public untuk membaca (melihat) gambar
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'uploads' );

-- SEMENTARA: Berikan akses INSERT/UPDATE/DELETE publik untuk menghindari segala error "bucket" saat testing
create policy "Public Upload Access"
on storage.objects for insert
with check ( bucket_id = 'uploads' );

create policy "Public Update Access"
on storage.objects for update
using ( bucket_id = 'uploads' );

create policy "Public Delete Access"
on storage.objects for delete
using ( bucket_id = 'uploads' );
