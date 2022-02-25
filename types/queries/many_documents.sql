SELECT
  d.*,
  coalesce(jsonb_agg(jsonb_build_object('name', contributor_info.full_name, 'role', attr.contribution_role)) FILTER (WHERE contributor_info IS NOT NULL), '[]')
    AS contributors
FROM document d
  LEFT JOIN contributor_attribution AS attr ON attr.document_id = d.id
  LEFT JOIN contributor_info ON contributor_info.id = attr.contributor_id
WHERE d.id = any($1)
GROUP BY d.id,
  attr.contributor_id,
  attr.document_id
