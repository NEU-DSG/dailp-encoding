SELECT sc.* 
FROM spatial_coverage sc
JOIN document_spatial_coverage dsc ON sc.id = dsc.spatial_coverage_id
WHERE dsc.document_id = $1;
