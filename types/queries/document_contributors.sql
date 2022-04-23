select
  attr.document_id,
  attr.contribution_role,
  contributor.id,
  contributor.full_name
from contributor_attribution as attr
  inner join contributor on contributor.id = attr.contributor_id
where attr.document_id = any($1)
