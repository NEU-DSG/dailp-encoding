-- Run against the migrated local database with psql --single-transaction.
-- addDocument uses this group regardless of the edited collection selected.
insert into document_group (slug, title)
values ('user_documents', 'User-Created Documents')
on conflict (slug) do nothing;

-- Leave the intro, chapters, and documents empty so they can be added in the UI.
insert into edited_collection (slug, title, description)
values ('localtest', 'Local Smoke Test', 'Sample collection for local UI testing.')
on conflict (slug) do nothing;
