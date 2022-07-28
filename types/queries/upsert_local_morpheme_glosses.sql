-- Insert a document-local morpheme gloss if and only if there's no matching
-- global gloss.
insert into morpheme_gloss (document_id, gloss)
select document_id, gloss from unnest($1::uuid[], $2::text[]) as input_data(document_id, gloss)
where not exists (select from morpheme_gloss where morpheme_gloss.document_id is null and morpheme_gloss.gloss = input_data.gloss)
on conflict (coalesce(document_id, uuid_nil()), gloss) do nothing
