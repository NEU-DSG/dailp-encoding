-- Take folder $1 out of the trash, along with the folders deleted with it.
-- $2 retention in days: past it, nothing is restored and no rows come back.
--
-- Deleting a folder stamps it and everything inside it with `now()` in one
-- transaction, and `now()` is fixed for a transaction, so the items deleted
-- together share one timestamp exactly. Anything inside that was deleted on its
-- own beforehand has an older stamp and stays in the trash.
with top as (
  select path, deleted_at from folders
  where id = $1 and deleted_at > now() - make_interval(days => $2::int)
)
update folders f
set deleted_at = null
from top
where f.path <@ top.path and f.deleted_at = top.deleted_at
returning f.id;
