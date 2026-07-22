select 
    kd.id, 
    kd.name, 
from key_date kd
join document_key_date dkd on kd.id = dkd.key_date_id
where dkd.document_id = $1;