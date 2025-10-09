-- Get all document associated with a given subject heading
SELECT d.*
FROM document d
JOIN document_subject_heading dsh ON d.id = dsh.document_id
WHERE dsh.subject_heading_id = $1;