-- Fetch all languages linked to a given set of documents
select
    dl.document_id,
    l.id,
    l.name,
    l.autonym,
    l.status::approval_status as status
from language l
join document_language dl on l.id = dl.language_id
where dl.document_id = any($1);
