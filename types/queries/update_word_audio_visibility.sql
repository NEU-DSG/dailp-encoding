-- Binds: word_id, slice_id, include_in_edited_collection, editor_id

with word_update as (
  -- update ingested audio, if the slice_id was ingested audio
  update word
  set include_audio_in_edited_collection=$3,
      audio_edited_by=$4
  where word.id = $1
    -- if the slice_id given doesn't match, we won't update
    and word.audio_slice_id = $2 
  returning word.id as word_id
),
word_user_media_update as (
-- update user contributed audio, if the slice id is user contributed audio tied to the word
  update word_user_media
  set include_in_edited_collection=$3,
      edited_by=$4
  where word_id = $1
    and media_slice_id = $2
    returning word_id
)

select distinct t.word_id
from (
  select word_id from word_update
  union
  select word_id from word_user_media_update
) as t