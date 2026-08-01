create table titres (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mal_id integer not null,
  titre text not null,
  image_url text,
  type text not null,
  statut text not null default 'a_voir',
  avancement integer not null default 0,
  note integer,
  created_at timestamptz not null default now()
);