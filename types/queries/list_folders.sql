-- Immediate subfolders of $1. Pass null to list the root.
-- `is not distinct from` is used so a null $1 matches the root's null parent_id,
-- which a plain `=` never would.
select id, parent_id, name
from folders
where parent_id is not distinct from $1
order by name;
