-- Get all document associated with a given subject heading
select d.*
from document d
join document_subject_heading dsh on d.id = dsh.document_id
where dsh.subject_heading_id = $1;