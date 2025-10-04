-- Get all document associated with a given creator
-- Factor in contributor visibility?
select d.*
from document d
join document_contributor dc on d.id = dc.document_id
where dc.contributor_id = $1;