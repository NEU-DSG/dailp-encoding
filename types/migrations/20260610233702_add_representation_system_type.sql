-- Add migration script here
UPDATE abstract_morpheme_tag
  SET representation_system_type = 'TAOC'
  WHERE representation_system_type IS NULL;

UPDATE morpheme_tag
  SET representation_system_type = 'TAOC'
  WHERE representation_system_type IS NULL;