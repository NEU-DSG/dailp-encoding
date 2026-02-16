with word_update as (
  update word set
      commentary =
          case
              when $2::text[] != '{}' and $2[1] is not null then $2[1]
              else commentary
          end,
      english_gloss =
          case
              when $3::text[] != '{}' and $3[1] is not null then $3[1]
              else english_gloss
          end
  where id = $1
  returning document_id
),
spelling_upsert as (
  insert into word_spelling (word_id, spelling_system, value)
  select
    $1,
    (select id from spelling_system where name = 'Source'),
    ($4::text[])[1]
  where $4::text[] != '{}' and ($4::text[])[1] is not null
  union all
  select
    $1,
    (select id from spelling_system where name = 'Simple Phonetics'),
    ($5::text[])[1]
  where $5::text[] != '{}' and ($5::text[])[1] is not null
  on conflict (word_id, spelling_system) do update set value = excluded.value
)
select document_id from word_update;
