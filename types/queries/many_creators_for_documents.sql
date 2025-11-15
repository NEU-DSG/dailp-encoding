-- Fetch all creators linked to a given set of documents
select
    dc.document_id,
    c.id,
    c.name
from creator c
join document_creator dc on c.id = dc.creator_id
where dc.document_id = any($1);