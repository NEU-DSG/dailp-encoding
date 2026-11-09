-- True if folder $2 is $1 itself or one of $1's descendants.
-- Used to reject folder moves that would create a cycle.
-- With ltree this is a single ancestor test (`@>`)
select coalesce(
  (select a.path @> b.path
   from folders a, folders b
   where a.id = $1 and b.id = $2),
  false
) as "contained!";
