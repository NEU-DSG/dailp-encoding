-- Every document's short_name in a given document_group. Used by the XML-backup
-- importer (`migration/src/mets_import.rs`) for its pre-flight collision scan and
-- post-import row-count sanity check -- nothing else needed "documents in this group."
select short_name
from document
where group_id = $1
