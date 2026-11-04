select kd.* 
from key_date kd
join document_key_date dkd
on dkd.key_date_id = kd.id 
where dkd.document_id = $1;