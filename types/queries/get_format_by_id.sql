select 
    f.id, 
    f.name, 
    f.status as "status: ApprovalStatus"
from doc_format f
where id = $1;