select
  d.*,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'name', contributor.full_name, 'role', attr.contribution_role
      )
    ) filter (where contributor is not null),
    '[]'
  )
  as contributors
from document as d
  left join contributor_attribution as attr on attr.document_id = d.id
  left join contributor on contributor.id = attr.contributor_id
where d.id = any($1)
group by d.id,
  attr.contributor_id,
  attr.document_id
