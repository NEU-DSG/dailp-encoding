-- Fetch all keywords linked to a given set of documents
select
    dk.document_id,
    k.id,
    k.name,
    k.status::approval_status as status
from keyword k
join document_keyword dk on k.id = dk.keyword_id
where dk.document_id = any($1);
