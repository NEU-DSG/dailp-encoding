insert into document (
  short_name, title, is_reference, written_at, audio_slice_id, group_id, index_in_group
)
values ($1, $2, $3, $4, $5, $6, $7)
on conflict (short_name) do update set
title = excluded.title,
is_reference = excluded.is_reference,
written_at = excluded.written_at,
audio_slice_id = excluded.audio_slice_id,
group_id = excluded.group_id,
index_in_group = excluded.index_in_group
returning id
