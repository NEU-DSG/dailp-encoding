select 
    id, 
    name, 
    status::approval_status as status
from doc_format
where id = $1;