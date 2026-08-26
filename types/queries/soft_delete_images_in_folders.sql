-- Soft-delete every live image whose folder is in the given set (used when a
-- folder subtree is deleted); already-deleted rows keep their deleted_at.
-- $1 = folder ids (uuid[]).
update images
set deleted_at = now()
where folder_id = any($1::uuid[]) and deleted_at is null;
