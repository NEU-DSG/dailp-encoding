-- Soft-delete the given folders by id (the original subtree after a move).
-- Already soft-deleted rows keep their original deleted_at. $1 = folder ids (uuid[]).
update folders
set deleted_at = now()
where id = any($1::uuid[]) and deleted_at is null;
