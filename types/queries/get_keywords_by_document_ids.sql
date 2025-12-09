select
  dk.document_id,
  k.id,
  k.name,
  k.status
from document_keyword dk
join keyword k on k.id = dk.keyword_id
where dk.document_id = any($1);