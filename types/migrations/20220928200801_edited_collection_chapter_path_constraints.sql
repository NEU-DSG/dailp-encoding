-- Add generated column for the collection slug to make queries looking for all
-- chapters within a collection easier.
alter table collection_chapter
add column collection_slug text not null
references edited_collection(slug) on delete cascade
generated always as (ltree2text(subpath(chapter_path, 0, 1))) stored;

-- Add generated column for the chapter slug.
alter table collection_chapter
add column slug text not null
generated always as (ltree2text(subpath(chapter_path, -1))) stored;

-- Ensure that chapters have no two chapters within the same collection share
-- the same slug.
alter table collection_chapter
add constraint slug_unique_within_collection
unique (collection_slug, slug);
