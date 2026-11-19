select
    l.id, 
    l.name, 
    l.status as "status: ApprovalStatus"
from language l
join document_language dl on l.id = dl.language_id
where dl.document_id = $1;