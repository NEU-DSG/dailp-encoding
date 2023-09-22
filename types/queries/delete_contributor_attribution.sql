DELETE FROM contributor_attribution
WHERE document_id = $1 AND contributor_id = $2;
