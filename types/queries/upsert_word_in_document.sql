-- Insert audio resource if there is one for this word.
with inserted_audio_resource as (
  insert into media_resource (url)
  select $12::text
  where $12 is not null
  on conflict (url) do nothing
),

inserted_audio_slice as (
  insert into media_slice (resource_id, time_range)
  select media_resource.id, int8range($13, $14)
  from media_resource
  where media_resource.url = $12
  returning id
)

insert into word (
  source_text, simple_phonetics, phonemic, english_gloss, recorded_at, commentary,
  document_id, page_number, index_in_document, page_id, character_range, audio_slice_id)
select $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, inserted_audio_slice.id
from (values (1)) as t
  left join inserted_audio_slice on true
returning id
