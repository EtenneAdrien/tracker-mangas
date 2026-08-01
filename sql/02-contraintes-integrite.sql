alter table titres
  add constraint statut_valide
    check (statut in ('a_voir', 'en_cours', 'termine')),
  add constraint note_valide
    check (note is null or (note >= 0 and note <= 10)),
  add constraint avancement_positif
    check (avancement >= 0),
  add constraint type_valide
    check (type in ('manga', 'anime'));