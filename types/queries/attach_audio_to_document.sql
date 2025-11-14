-- Binds: user_id, resource_url, start, end, document_id

with upserted_audio_resource as (
  insert into media_resource (url, recorded_at, recorded_by)
  select $2::text, now(), $1
  -- we do this no-op update to ensure an id is returned
  on conflict (url) do update set url=excluded.url
  returning id
),

inserted_audio_slice as (
  insert into media_slice (resource_id, time_range)
  select upserted_audio_resource.id, int8range($3, $4)
  from upserted_audio_resource
  returning id
)

insert into document_user_media (document_id, media_slice_id)
  select $5, inserted_audio_slice.id
  from inserted_audio_slice
  join document on document.id = $5
    on conflict (media_slice_id, document_id) do nothing -- document already associated
  returning media_slice_id