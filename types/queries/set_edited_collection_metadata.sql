-- `upsert_collection.sql` only ever writes slug/title/wordpress_menu_id -- this fills in
-- the two columns it leaves untouched (description, thumbnail_url), as a separate,
-- additive call, so that query's existing Sheets-import caller isn't affected by this.
-- Used by the XML-backup importer (`migration/src/mets_import.rs`), which can recover a
-- collection's description (but not its wordpress_menu_id or thumbnail_url -- see
-- `migration/import-from-xml.md`) from the exported bundle.
update edited_collection
set
  description = coalesce($2, description),
  thumbnail_url = coalesce($3, thumbnail_url)
where slug = $1
