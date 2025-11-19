-- Add migration script here
ALTER TABLE edited_collection 
<<<<<<< HEAD
ADD COLUMN description TEXT,
ADD COLUMN thumbnail_url TEXT;
=======
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
>>>>>>> d517c64075386145b85f531f3d9b468be2690e69
