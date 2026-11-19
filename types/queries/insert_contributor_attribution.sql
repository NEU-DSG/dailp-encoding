insert into contributor_attribution (document_id, contributor_id, contribution_role)
values ($1, $2, $3)
on conflict (document_id, contributor_id) do update
set contribution_role = excluded.contribution_role;