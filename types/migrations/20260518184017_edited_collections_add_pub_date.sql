-- Add migration script here
ALTER TABLE edited_collection ADD COLUMN publication_date DATE;
ALTER TABLE edited_collection ADD COLUMN editors TEXT[];