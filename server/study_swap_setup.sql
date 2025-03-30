-- =============================================
-- Create the Notes Table
-- =============================================
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  subject text,
  file_url text not null,
  uploaded_by text not null,
  timestamp timestamptz default now()
);

-- =============================================
-- Enable Row Level Security
-- =============================================
alter table notes enable row level security;

-- =============================================
-- Policies
-- =============================================

-- Allow SELECT for everyone
create policy "Allow all to read notes"
on notes
for select
using (true);

-- Allow INSERT only if authenticated
create policy "Allow insert by authenticated users"
on notes
for insert
to authenticated
with check (auth.role() = 'authenticated');

-- =============================================
-- Create Supabase Storage Bucket
-- =============================================
-- 🔧 NOTE: Supabase doesn't support SQL creation of buckets yet.
-- You must manually:
-- 1. Go to Supabase Dashboard → Storage
-- 2. Click [New Bucket]
-- 3. Name it `notes`
-- 4. Set it to Public

-- =============================================
-- Public Read Policy for Storage Bucket
-- =============================================
-- Applies to public access of uploaded files
create policy "Allow public read access to notes bucket"
on storage.objects
for select
using (bucket_id = 'notes');

alter table notes disable row level security;

drop policy if exists "Allow insert by authenticated users" on notes;

create policy "Allow insert by anyone (including backend)"
on notes
for insert
with check (true);

-- Policy for uploading files to storage
create policy "Allow uploads to notes bucket"
on storage.objects
for insert
to authenticated, service_role
with check (bucket_id = 'notes');