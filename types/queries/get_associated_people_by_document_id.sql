select p.* 
from associated_person p
join document_associated_person dp
on dp.associated_person_id = p.id 
where dp.document_id = $1;