-- Folders anywhere in the library whose name contains $1, case-insensitively.
-- Includes soft-deleted ones, like the other listings - callers filter out
-- `deleted_at` rows in code.
select id, parent_id, name, path::text as "path!", created_at, deleted_at,
       size_bytes
from folders
where position(lower($1) in lower(name)) > 0
order by name;
