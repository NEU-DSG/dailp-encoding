select
    d.id,
    coalesce(
        jsonb_agg(
            jsonb_build_object(
                'id', c.id,
                'name', c.full_name,
            )
        ) filter (where c.id is not null),
        '[]'
    ) as contributors
from document d
left join document_keyword dc on dc.document_id = d.id
left join contributor c on c.id = dc.contributor_id
where d.id = $1
group by d.id;