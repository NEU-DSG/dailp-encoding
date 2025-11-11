select 
    g.id, 
    g.name, 
    g.status as "status: ApprovalStatus"
from genre g
where id = $1;