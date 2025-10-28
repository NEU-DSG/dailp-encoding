select
    id, 
    name, 
    autonym,
    status::approval_status as status
from language l
join document_language dl on l.id = dl.language_id
where dl.document_id = $1;
