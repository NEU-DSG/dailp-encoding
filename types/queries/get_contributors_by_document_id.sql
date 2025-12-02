select 
    c.id,
    c.full_name as name,
    c.role::contributor_role as role
from document_contributor dc
join contributor c on c.id = dc.contributor_id
where dc.document_id = $1;