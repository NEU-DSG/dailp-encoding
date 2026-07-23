-- True if folder $2 is $1 itself or one of $1's descendants.
-- Used to reject folder moves that would create a cycle.
-- Collects $1 and everything beneath it, then checks whether the proposed new
-- parent ($2) falls inside that subtree.
with recursive subtree as (
  select id from folders where id = $1
  union all
  select f.id
  from folders f
  join subtree s on f.parent_id = s.id
)
select exists (select 1 from subtree where id = $2) as "contained!";
