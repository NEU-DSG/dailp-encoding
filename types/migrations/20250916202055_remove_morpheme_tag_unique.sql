-- Add migration script here

-- FROM init sql:
-- TODO Remove this unique constraint once we aren't reliant on spreadsheets
-- constraint morpheme_tag_unique unique (system_id, abstract_ids)

ALTER TABLE morpheme_tag DROP CONSTRAINT morpheme_tag_unique;