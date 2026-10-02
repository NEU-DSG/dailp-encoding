-- The ancestor trail of the folder at path $1, root first, including the folder
-- itself. `@>` selects every folder whose path is a prefix of $1, so ordering by
-- depth yields the breadcrumbs directly -- no recursion, and it works from any
-- entry point rather than only from walking down.
select id, parent_id, name, path::text as "path!", created_at, deleted_at,
       size_bytes
from folders
where path @> $1::ltree and deleted_at is null
order by nlevel(path);
