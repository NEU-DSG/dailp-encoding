select
    dp.document_id,
    p.id,
    p.name
from associated_person p
join document_associated_person dp on p.id = dp.associated_person_id
where dp.document_id = any($1);