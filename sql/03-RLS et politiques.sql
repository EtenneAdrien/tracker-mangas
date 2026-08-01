alter table titres enable row level security;

create policy "lecture de ses propres titres"
  on titres for select
  using (auth.uid() = user_id);

create policy "ajout de ses propres titres"
  on titres for insert
  with check (auth.uid() = user_id);

create policy "modification de ses propres titres"
  on titres for update
  using (auth.uid() = user_id);

create policy "suppression de ses propres titres"
  on titres for delete
  using (auth.uid() = user_id);