INSERT INTO document (id, title, is_reference, written_at, audio_slice_id)
  VALUES ($1, $2, $3, $4, $5)
ON CONFLICT DO NOTHING
