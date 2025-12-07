-- Get all document associated with a given genre
select d.*
from document d
where d.genre_id = $1;