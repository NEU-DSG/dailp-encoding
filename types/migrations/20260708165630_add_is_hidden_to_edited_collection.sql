-- Add migration script here
ALTER TABLE edited_collection ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT false;