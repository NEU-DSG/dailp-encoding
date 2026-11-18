-- Binds: document_id, slice_id, include_in_edited_collection, editor_id

with document_update as (
  -- update ingested audio, if the slice_id was ingested audio
  update document
  set include_audio_in_edited_collection=$3,
      audio_edited_by=$4
  where document.id = $1
    -- if the slice_id given doesn't match, we won't update
    and document.audio_slice_id = $2 
  returning document.id as document_id
),
document_user_media_update as (
-- update user contributed audio, if the slice id is user contributed audio tied to the document
  update document_user_media
  set include_in_edited_collection=$3,
      edited_by=$4
  where document_id = $1
    and media_slice_id = $2
    returning document_id
)

select distinct t.document_id
from (
  select document_id from document_update
  union
  select document_id from document_user_media_update
) as t