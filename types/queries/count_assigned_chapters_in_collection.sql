--- Coutns the number of subchatpers and ignores unassigned chapters index -1
select count(*)
from collection_chapter
where collection_slug = $1
and index_in_parent != -1