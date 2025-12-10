-- Get all document associated with a given keyword
select d.*
from document d
join document_keyword dk on d.id = dk.document_id
where dk.keyword_id = $1;