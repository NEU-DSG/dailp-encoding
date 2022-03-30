delete from media_resource
where id in (
  select media_slice.resource_id
  from media_slice
    inner join document on document.audio_slice_id = media_slice.id
  where document.short_name = $1
)
