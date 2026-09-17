-- Add representation_system_type column
ALTER TABLE word_segment
  ADD COLUMN representation_system_type representation_system_type;

-- Backfill existing rows 
UPDATE word_segment ws
SET representation_system_type = amt.representation_system_type
FROM morpheme_gloss mg
JOIN abstract_morpheme_tag amt ON amt.id = mg.tag_id
WHERE mg.id = ws.gloss_id;

-- Default any remaining nulls to TAOC
UPDATE word_segment
SET representation_system_type = 'TAOC'
WHERE representation_system_type IS NULL;

-- Drop old unique constraint
ALTER TABLE word_segment
  DROP CONSTRAINT word_segment_word_id_index_in_word_key;

-- Add new unique constraint including system
ALTER TABLE word_segment
  ADD CONSTRAINT word_segment_word_id_index_system_key
  UNIQUE (word_id, index_in_word, representation_system_type);