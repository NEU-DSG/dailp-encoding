-- Returns all keywords for a document as a JSON array
select
    d.id,
    coalesce(
        jsonb_agg(
            jsonb_build_object(
                'id', k.id,
                'name', k.name,
                'status', k.status
            )
        ) filter (where k.id is not null),
        '[]'
    ) as keywords
from document d
left join document_keyword dk on dk.document_id = d.id
left join keyword k on k.id = dk.keyword_id
where d.id = $1
group by d.id;