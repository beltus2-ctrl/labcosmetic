create table public.project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.project_versions enable row level security;

create policy "Users can view their own project versions"
  on public.project_versions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own project versions"
  on public.project_versions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own project versions"
  on public.project_versions for delete
  using (auth.uid() = user_id);

create index project_versions_project_id_idx on public.project_versions (project_id, created_at desc);
