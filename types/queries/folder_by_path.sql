-- Resolve a live folder from its path, e.g. `partners.logos`. $1 = path text.
-- Soft-deleted rows are excluded: a deleted folder frees its path for reuse, so
-- only the live one is addressable.
select id, parent_id, name, path::text as "path!", created_at, deleted_at,
       size_bytes
from folders
where path = $1::ltree and deleted_at is null;
