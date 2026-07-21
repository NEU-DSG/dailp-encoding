-- Add migration script here
alter table word_segment
  add constraint word_segment_word_id_index_in_word_key
  unique (word_id, index_in_word, system_id);

alter table word_segment
  add column if not exists system_id uuid references abbreviation_system(id);