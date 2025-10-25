select 
    id, 
    name, 
    status::approval_status as status
from keyword k
join document_keyword dk on dk.keyword_id = k.id
where dk.document_id = $1;