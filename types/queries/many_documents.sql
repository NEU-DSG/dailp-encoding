select
  d.*,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'name', contributor_info.full_name, 'role', attr.contribution_role
      )
    ) filter (where contributor_info is not null),
    '[]'
  )
  as contributors
from document as d
  left join contributor_attribution as attr on attr.document_id = d.id
  left join contributor_info on contributor_info.id = attr.contributor_id
where d.id = any($1)
group by d.id,
  attr.contributor_id,
  attr.document_id
