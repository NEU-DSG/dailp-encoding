CREATE TYPE representation_system_type AS ENUM ('CRG', 'LEARNER', 'TAOC');

ALTER TABLE abstract_morpheme_tag
  ADD COLUMN representation_system_type representation_system_type;

ALTER TABLE morpheme_tag
  ADD COLUMN representation_system_type representation_system_type;