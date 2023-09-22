INSERT INTO contributor_attribution (document_id, contributor_id, contribution_role)
VALUES ($1, $2, $3)
ON CONFLICT (document_id, contributor_id)
DO UPDATE SET contribution_role = $3;