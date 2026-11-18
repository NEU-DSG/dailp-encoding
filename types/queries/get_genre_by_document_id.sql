SELECT
  g.id,
  g.name,
  g.status as "status: ApprovalStatus"
FROM genre g
JOIN document d ON d.genre_id = g.id
WHERE d.id = $1;
