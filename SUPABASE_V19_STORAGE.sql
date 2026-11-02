-- Run once in Supabase SQL Editor. Existing library_backups remains unchanged.
insert into storage.buckets (id,name,public,file_size_limit)
values ('library-assets','library-assets',false,41943040)
on conflict (id) do update set public=false, file_size_limit=41943040;

drop policy if exists "library assets select own" on storage.objects;
drop policy if exists "library assets insert own" on storage.objects;
drop policy if exists "library assets update own" on storage.objects;
drop policy if exists "library assets delete own" on storage.objects;
create policy "library assets select own" on storage.objects for select to authenticated
using (bucket_id='library-assets' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "library assets insert own" on storage.objects for insert to authenticated
with check (bucket_id='library-assets' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "library assets update own" on storage.objects for update to authenticated
using (bucket_id='library-assets' and (storage.foldername(name))[1]=(select auth.uid())::text)
with check (bucket_id='library-assets' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "library assets delete own" on storage.objects for delete to authenticated
using (bucket_id='library-assets' and (storage.foldername(name))[1]=(select auth.uid())::text);
