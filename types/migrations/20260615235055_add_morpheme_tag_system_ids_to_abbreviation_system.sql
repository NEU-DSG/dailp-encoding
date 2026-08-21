-- Add TAOC, CRG, LEARNER to abbreviation_system
INSERT INTO abbreviation_system (short_name, title) VALUES 
  ('TAOC', 'Tone and Accent in Oklahoma Cherokee'),
  ('CRG', 'Cherokee Reference Grammar'),
  ('LEARNER', 'Learner')
ON CONFLICT (short_name) DO NOTHING;

-- Update morpheme_tag.system_id to match the representation_system_type
-- of its linked abstract_morpheme_tag
UPDATE morpheme_tag mt
SET system_id = ab.id
FROM abstract_morpheme_tag amt
INNER JOIN abbreviation_system ab 
  ON ab.short_name = amt.representation_system_type::text
WHERE amt.id = mt.abstract_ids[1];