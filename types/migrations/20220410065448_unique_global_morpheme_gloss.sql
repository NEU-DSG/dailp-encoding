-- Morpheme glosses with a null document_id were getting duplicated because
-- Postgres unique constraints allow multiple nulls, so we have to create a
-- coalescing unique index instead.
alter table morpheme_gloss
drop constraint morpheme_gloss_document_id_gloss_key;

-- Loosen the foreign key constraint on word segments.
-- This will allow me to delete duplicate glosses that are in use.
alter table word_segment
alter column gloss_id drop not null,
drop constraint word_segment_gloss_id_fkey,
add constraint word_segment_gloss_id_fkey
  foreign key (gloss_id) references morpheme_gloss (id) on delete set null;

-- Delete duplicate morpheme glosses.
delete from morpheme_gloss as a
  using morpheme_gloss as b
where a.document_id is null
  and b.document_id is null
  and a.gloss = b.gloss;

-- Force null document_id to participate in uniqueness.
create unique index
morpheme_gloss_document_id_gloss_key ON morpheme_gloss
(coalesce(document_id, uuid_nil()), gloss);
