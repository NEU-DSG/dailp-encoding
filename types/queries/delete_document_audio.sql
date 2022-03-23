delete from audio_resource
where id in (
  select audio_slice.resource_id
  from audio_slice
    inner join document on document.audio_slice_id = audio_slice.id
  where document.id = $1
)
