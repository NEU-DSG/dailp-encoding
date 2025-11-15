select
    d.id,
    coalesce(
        jsonb_agg(
            jsonb_build_object(
                'id', sc.id,
                'name', sc.name,
                'status', sc.status
            )
        ) filter (where sc.id is not null),
        '[]'
    ) as spatial_coverage
from document d
left join document_spatial_coverage dsc on dsc.document_id = d.id
left join spatial_coverage sc on sc.id = dsc.spatial_coverage_id
where d.id = $1
group by d.id;