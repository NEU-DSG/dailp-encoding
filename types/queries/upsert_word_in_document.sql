insert into word (
  source_text, simple_phonetics, phonemic, english_gloss, recorded_at, commentary,
  document_id, page_number, index_in_document, page_id, character_range, audio_slice_id)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
on conflict (document_id, index_in_document) do update set
source_text = excluded.source_text,
simple_phonetics = excluded.simple_phonetics,
phonemic = excluded.phonemic,
english_gloss = excluded.english_gloss,
commentary = excluded.commentary,
audio_slice_id = excluded.audio_slice_id
returning id
