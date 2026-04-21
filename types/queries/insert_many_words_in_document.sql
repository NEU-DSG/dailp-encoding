with word_input as (
  select * from unnest(
    $1::uuid[], $2::text[], $3::text[], $4::text[], $5::date[], $6::text[], $7::text[], $8::bigint[]
  ) as t(document_id, source_text, simple_phonetics, english_gloss, recorded_at, commentary, page_number, index_in_document)
),
inserted_words as (
  insert into word (document_id, english_gloss, recorded_at, commentary, page_number, index_in_document)
  select document_id, english_gloss, recorded_at, commentary, page_number, index_in_document
  from word_input
  returning id, document_id, index_in_document
),
source_insert as (
  insert into word_spelling (word_id, spelling_system, value)
  select distinct on (iw.id) iw.id,
    (select id from spelling_system where name = 'Source'),
    wi.source_text
  from inserted_words iw
  join word_input wi on wi.document_id = iw.document_id
    and wi.index_in_document = iw.index_in_document
  where wi.source_text is not null
  on conflict (word_id, spelling_system) do update set value = excluded.value
),
phonetics_insert as (
  insert into word_spelling (word_id, spelling_system, value)
  select distinct on (iw.id) iw.id,
    (select id from spelling_system where name = 'Simple Phonetics'),
    wi.simple_phonetics
  from inserted_words iw
  join word_input wi on wi.document_id = iw.document_id
    and wi.index_in_document = iw.index_in_document
  where wi.simple_phonetics is not null
  on conflict (word_id, spelling_system) do update set value = excluded.value
)
select id from inserted_words
