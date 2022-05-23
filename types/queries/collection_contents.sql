/* Will return information on chapters in their proper order,
      like a table of contents
$1:collection id
*/
select *
from chapter 
where subpath(index_tree, 0, 1)=(select slug from collections where id=$1)
order by string_to_array(subpath(index_tree, 1)::text, '.')::int[];