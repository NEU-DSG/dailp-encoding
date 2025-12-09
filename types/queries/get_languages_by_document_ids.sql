select
  dl.document_id,
  l.id,
  l.name,
  l.status
from document_language dl
join language l on l.id = dl.language_id
where dl.document_id = any($1);