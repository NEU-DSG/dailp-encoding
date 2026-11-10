-- Permanently remove folders past the trash retention period. $1 retention in
-- days. Run after the images in them are gone. A folder and its subfolders can
-- go in one statement: the parent reference is only checked once it finishes.
delete from folders
where deleted_at < now() - make_interval(days => $1::int);
