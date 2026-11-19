select
  dcr.document_id,
  cr.id,
  cr.name
from document_creator dcr
join creator cr on cr.id = dcr.creator_id
where dcr.document_id = any($1);