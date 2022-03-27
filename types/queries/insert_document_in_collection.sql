INSERT INTO document (short_name, title, is_reference, written_at, audio_slice_id, group_id, index_in_group)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (short_name) DO UPDATE SET
   title = excluded.title,
   is_reference = excluded.is_reference,
   written_at = excluded.written_at,
   audio_slice_id = excluded.audio_slice_id,
   group_id = excluded.group_id,
   index_in_group = excluded.index_in_group
RETURNING id
