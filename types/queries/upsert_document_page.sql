insert into document_page (document_id, index_in_document, iiif_source_id, iiif_oid)
values ($1, $2, $3, $4)
on conflict (document_id, index_in_document) do update set
index_in_document = excluded.index_in_document,
iiif_source_id = excluded.iiif_source_id,
iiif_oid = excluded.iiif_oid
returning id
