-- Buat bucket penyimpanan (storage) bernama "uploads"
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true) ON CONFLICT (id) DO NOTHING;

-- Berikan akses public untuk membaca (melihat) gambar
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'uploads' );

-- Berikan akses untuk insert (upload) gambar bagi user yang sudah login (authenticated admin)
create policy "Authenticated users can upload photos"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'uploads' );

-- Berikan akses untuk delete gambar bagi user yang sudah login
create policy "Authenticated users can delete photos"
on storage.objects for delete
to authenticated
using ( bucket_id = 'uploads' );

-- Berikan akses untuk update gambar bagi user yang sudah login
create policy "Authenticated users can update photos"
on storage.objects for update
to authenticated
using ( bucket_id = 'uploads' );
