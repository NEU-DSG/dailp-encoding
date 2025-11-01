select
    d.id,
    coalesce(
        jsonb_agg(
            jsonb_build_object(
                'id', sh.id,
                'name', sh.name,
                'status', sh.status
            )
        ) filter (where sh.id is not null),
        '[]'
    ) as subject_headings
from document d
left join document_subject_heading dsh on dsh.document_id = d.id
left join subject_heading sh on sh.id = dsh.subject_heading_id
where d.id = $1
group by d.id;