-- Add migration script here
ALTER TABLE edited_collection 
ADD COLUMN description TEXT,
ADD COLUMN thumbnail_url TEXT;
