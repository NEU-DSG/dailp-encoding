select
  dsh.document_id,
  sh.id,
  sh.name,
  sh.status
from document_subject_heading dsh
join subject_heading sh on sh.id = dsh.subject_heading_id
where dsh.document_id = any($1);