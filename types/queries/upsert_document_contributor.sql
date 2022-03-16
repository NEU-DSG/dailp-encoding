insert into contributor_attribution (contributor_id, document_id, contribution_role)
select contributor.id, $2, $3
from contributor
where contributor.full_name = $1
