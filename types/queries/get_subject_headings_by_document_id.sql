select 
    sh.id, 
    sh.name, 
    sh.status as "status: ApprovalStatus"
from subject_heading sh
join document_subject_heading dsh on sh.id = dsh.subject_heading_id
where dsh.document_id = $1;