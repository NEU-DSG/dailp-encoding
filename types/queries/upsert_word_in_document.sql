-- Insert audio resource if there is one for this word.
with inserted_audio_resource as (
  insert into media_resource (url)
  select $9::text
  where $9 is not null
  on conflict (url) do nothing
),

inserted_audio_slice as (
  insert into media_slice (resource_id, time_range)
  select media_resource.id, int8range($10, $11)
  from media_resource
  where media_resource.url = $9
  returning id
),

inserted_word as (
  insert into word (
    english_gloss, recorded_at, commentary,
    document_id, page_number, index_in_document, page_id, character_range, audio_slice_id)
  select $1, $2, $3, $4, $5, $6, $7, $8, inserted_audio_slice.id
  from (values (1)) as t
    left join inserted_audio_slice on true
  returning id
),

source_insert as (
  insert into word_spelling (word_id, spelling_system, value)
  select id,
    (select id from spelling_system where name = 'Source'),
    $12::text
  from inserted_word
  where $12 is not null
),

phonetics_insert as (
  insert into word_spelling (word_id, spelling_system, value)
  select id,
    (select id from spelling_system where name = 'Simple Phonetics'),
    $13::text
  from inserted_word
  where $13 is not null
)

select id from inserted_word
