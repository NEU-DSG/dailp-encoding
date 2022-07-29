insert into contributor_attribution (contributor_id, document_id, contribution_role)
select
  contributor.id,
  input_data.doc_id,
  input_data.contribution_role
from
  unnest(
    $1::text[], $2::uuid[], $3::text[]
  ) as input_data(full_name, doc_id, contribution_role)
  inner join contributor on contributor.full_name = input_data.full_name
-- If this document already has this contributor, move on.
on conflict do nothing
