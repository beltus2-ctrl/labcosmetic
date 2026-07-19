create table public.user_compounds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.user_compounds enable row level security;

create policy "Users can view their own compounds"
  on public.user_compounds for select
  using (auth.uid() = user_id);

create policy "Users can insert their own compounds"
  on public.user_compounds for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own compounds"
  on public.user_compounds for update
  using (auth.uid() = user_id);

create policy "Users can delete their own compounds"
  on public.user_compounds for delete
  using (auth.uid() = user_id);

create index user_compounds_user_id_idx on public.user_compounds (user_id, created_at desc);
