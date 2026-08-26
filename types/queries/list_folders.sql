-- All immediate subfolders of $1, including soft-deleted ones - callers filter
-- out `deleted_at` rows in code. Pass null to list the root (`is not distinct
-- from` so a null $1 matches the root's null parent_id).
select id, parent_id, name, path::text as "path!", created_at, deleted_at,
       size_bytes
from folders
where parent_id is not distinct from $1
order by name;
