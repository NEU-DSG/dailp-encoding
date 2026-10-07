-- One folder by id, live or soft-deleted.
select id, parent_id, name, path::text as "path!", created_at, deleted_at,
       size_bytes
from folders
where id = $1;
