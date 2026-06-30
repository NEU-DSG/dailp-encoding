-- Add the isHidden to editec collections for if it is shown or not
ALTER TABLE edited_collection
  ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;