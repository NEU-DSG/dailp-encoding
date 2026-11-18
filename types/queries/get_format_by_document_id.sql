SELECT
  f.id,
  f.name,
  f.status as "status: ApprovalStatus"
FROM doc_format f
JOIN document d ON d.format_id = f.id
WHERE d.id = $1;