-- Add migration script here
alter table morpheme_gloss
  add column system_id uuid references abbreviation_system(id);