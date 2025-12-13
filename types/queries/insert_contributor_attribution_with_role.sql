-- Adds a contributor attribution with role
insert into contributor_attribution (document_id, contributor_id, contribution_role)
values ($1, $2, $3);