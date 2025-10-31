select
    d.id,
    coalesce(
        jsonb_agg(
            jsonb_build_object(
                'id', l.id,
                'name', l.name,
                'autonym', l.autonym,
                'status', l.status
            )
        ) filter (where l.id is not null),
        '[]'
    ) as languages
from document d
left join document_language dl on dl.document_id = d.id
left join language l on l.id = dl.language_id
where d.id = $1
group by d.id;