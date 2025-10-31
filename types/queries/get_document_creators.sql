select
    d.id,
    coalesce(
        jsonb_agg(
            jsonb_build_object(
                'id', cr.id,
                'name', cr.name
            )
        ) filter (where cr.id is not null),
        '[]'
    ) as creator
from document d
left join document_creator dcr on dcr.document_id = d.id
left join creator cr on cr.id = dcr.creator_id
where d.id = $1
group by d.id;