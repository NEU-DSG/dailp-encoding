-- Add migration script here
ALTER TABLE collection_chapter ADD COLUMN publication_date DATE;
ALTER TABLE collection_chapter ADD COLUMN authors TEXT[];