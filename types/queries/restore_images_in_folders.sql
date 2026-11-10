-- Take the images that were deleted along with a folder out of the trash.
-- $1 the restored folder ids, $2 the folder's deletion timestamp.
update images
set deleted_at = null
where folder_id = any($1::uuid[]) and deleted_at = $2;
