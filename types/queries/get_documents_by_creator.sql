-- Get all document associated with a given creator
select d.*
from document d
join document_creator dcr on d.id = dcr.document_id
where dc.creator_id = $1;