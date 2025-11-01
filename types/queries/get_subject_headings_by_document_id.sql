select 
    id, 
    name, 
    status::approval_status as status
from subject_heading s
join document_subject_heading dsh on s.id = dsh.subject_heading_id
where dsh.document_id = any($1);