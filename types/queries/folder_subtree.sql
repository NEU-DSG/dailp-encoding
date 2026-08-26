-- All folders in the subtree rooted at $1 (including $1), live and soft-deleted
-- alike. Used to soft-delete a whole folder subtree. With ltree this is a single
-- descendant test (`<@`), replacing the previous recursive CTE -- so the
-- nullability overrides that a recursive CTE forced are no longer needed.
select f.id, f.parent_id, f.name, f.path::text as "path!", f.created_at,
       f.deleted_at, f.size_bytes
from folders f
where f.path <@ (select path from folders where id = $1)
order by f.path;
