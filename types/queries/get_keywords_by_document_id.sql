select 
    k.id, 
    k.name, 
    k.status::text as status
from keyword k
join document_keyword dk on dk.keyword_id = k.id
where dk.document_id = $1;
