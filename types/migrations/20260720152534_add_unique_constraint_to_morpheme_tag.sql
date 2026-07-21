alter table morpheme_tag
  add constraint morpheme_tag_gloss_system_key
  unique (gloss, system_id);