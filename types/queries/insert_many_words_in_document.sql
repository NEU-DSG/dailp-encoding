insert into word (document_id, source_text, simple_phonetics, phonemic, english_gloss, recorded_at, commentary,
  page_number, index_in_document)
select * from unnest($1::uuid[], $2::text[], $3::text[], $4::text[], $5::text[], $6::date[], $7::text[], $8::text[], $9::bigint[])
returning id
