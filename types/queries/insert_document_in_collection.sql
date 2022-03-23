INSERT INTO document (id, title, is_reference, written_at, audio_slice_id, group_id, index_in_group)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT DO NOTHING
