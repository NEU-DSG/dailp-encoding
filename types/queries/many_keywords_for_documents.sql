-- Fetch all keywords linked to a given set of documents
select
    k.id,
    k.name,
    k.status as "status: ApprovalStatus"
from keyword k
join document_keyword dk on k.id = dk.keyword_id
where dk.document_id = any($1);