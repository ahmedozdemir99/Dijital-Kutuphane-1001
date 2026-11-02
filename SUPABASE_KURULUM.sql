-- Supabase SQL Editor'de çalıştırın. Her kullanıcı sadece kendi yedeğini görebilir.
create table if not exists public.library_backups (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.library_backups enable row level security;
create policy "Owner can read backup" on public.library_backups for select to authenticated using ((select auth.uid()) = user_id);
create policy "Owner can insert backup" on public.library_backups for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Owner can update backup" on public.library_backups for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
