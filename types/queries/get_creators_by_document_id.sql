select c.* 
from creator c 
join document_creator dc 
on dc.creator_id = c.id 
where dc.document_id = $1;