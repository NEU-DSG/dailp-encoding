-- Add migration script here
ALTER TABLE edited_collection 
ADD COLUMN if not exists description TEXT,
ADD COLUMN if not exists thumbnail_url TEXT;
