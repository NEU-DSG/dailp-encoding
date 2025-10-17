select 
    id, 
    name, 
    status::text as status
from doc_format
where id = $1;
