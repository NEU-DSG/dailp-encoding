-- Get all document associated with a given format
select d.*
from document d
where d.format_id = $1;