select 
    c.id,
    c.name,
    c.full_name,
    dc.role::text as role
from document_contributor dc
join contributor c on c.id = dc.contributor_id
where dc.document_id = $1;
