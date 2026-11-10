-- Permanently remove images past the trash retention period, along with any
-- inside a folder that is. $1 retention in days. Their copies and page
-- references go too, through `on delete cascade`; the S3 objects stay.
delete from images
where deleted_at < now() - make_interval(days => $1::int)
   or folder_id in (
     select id from folders
     where deleted_at < now() - make_interval(days => $1::int)
   );
