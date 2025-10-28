-- Fetch all subject headings linked to a given set of documents
select
    dsh.document_id,
    sh.id,
    sh.name,
    sh.status::approval_status as status
from subject_heading sh
join document_subject_heading dsh on sh.id = dsh.subject_heading_id
where dsh.document_id = any($1);
