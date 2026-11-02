-- Run after SUPABASE_KURULUM.sql. Atomic compare-and-swap prevents lost updates.
create table if not exists public.library_backups (
 user_id uuid primary key references auth.users(id) on delete cascade,
 payload jsonb not null,
 updated_at timestamptz not null default now()
);
alter table public.library_backups enable row level security;
create or replace function public.commit_library_backup(expected_updated_at timestamptz, new_payload jsonb)
returns timestamptz language plpgsql security invoker set search_path = public as $$
declare saved_at timestamptz;
begin
 if auth.uid() is null then raise exception 'Login required'; end if;
 if jsonb_typeof(new_payload->'books') <> 'array' or jsonb_typeof(new_payload->'poems') <> 'array' or jsonb_typeof(new_payload->'quotes') <> 'array' or jsonb_typeof(new_payload->'loans') <> 'array' then
   raise exception 'Invalid library payload';
 end if;
 if expected_updated_at is null then
   insert into public.library_backups(user_id,payload,updated_at)
   values (auth.uid(),new_payload,clock_timestamp())
   on conflict (user_id) do nothing returning updated_at into saved_at;
 else
   update public.library_backups set payload=new_payload, updated_at=clock_timestamp()
   where user_id=auth.uid() and updated_at=expected_updated_at
   returning updated_at into saved_at;
 end if;
 if saved_at is null then raise exception 'SYNC_CONFLICT: Cloud changed; retry after refreshing'; end if;
 return saved_at;
end $$;
revoke all on function public.commit_library_backup(timestamptz,jsonb) from public;
grant execute on function public.commit_library_backup(timestamptz,jsonb) to authenticated;
-- Private storage policies; create bucket in dashboard if not present.
insert into storage.buckets(id,name,public,file_size_limit) values('library-assets','library-assets',false,52428800)
on conflict (id) do update set public=false;
create policy "library-assets-own-read-v21" on storage.objects for select to authenticated
using(bucket_id='library-assets' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "library-assets-own-insert-v21" on storage.objects for insert to authenticated
with check(bucket_id='library-assets' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "library-assets-own-update-v21" on storage.objects for update to authenticated
using(bucket_id='library-assets' and (storage.foldername(name))[1]=auth.uid()::text)
with check(bucket_id='library-assets' and (storage.foldername(name))[1]=auth.uid()::text);
