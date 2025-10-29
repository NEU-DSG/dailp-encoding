-- Add migration script here
ALTER TABLE edited_collection 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
