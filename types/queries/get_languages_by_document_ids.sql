select
  dl.document_id,
  l.id,
  l.name,
  l.status as "status: ApprovalStatus"
from document_language dl
join language l on l.id = dl.language_id
where dl.document_id = any($1);