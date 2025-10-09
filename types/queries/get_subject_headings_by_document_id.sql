SELECT s.* 
FROM subject_heading s
JOIN document_subject_heading dsh ON s.id = dsh.subject_heading_id
WHERE dsh.document_id = $1;
