insert into character_transcription (
  page_id, index_in_page, possible_transcriptions
)
select $1, index, array[transcription] from unnest($2::bigint[], $3::text[]) as t(index, transcription)
