-- The total size of the images in folder $1 and its subfolders.
-- Everything in a folder shares its `deleted_at`: null while it's live, or the
-- stamp from when it was deleted. Anything removed on its own beforehand has an
-- older stamp, and is no longer part of the folder.
select coalesce(sum(i.size_bytes), 0)::bigint as "size_bytes!"
from folders top
join folders f
  on f.path <@ top.path and f.deleted_at is not distinct from top.deleted_at
join images i
  on i.folder_id = f.id and i.deleted_at is not distinct from top.deleted_at
where top.id = $1;
