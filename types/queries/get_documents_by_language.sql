-- Get all document associated with a given language
select d.*
from document d
join document_language dl on d.id = dl.document_id
where dl.language_id = $1;