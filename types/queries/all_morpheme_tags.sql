with t as (
  select distinct on (morpheme_tag.gloss)
    abbreviation_system.short_name as system_name,
    morpheme_tag.abstract_ids,
    morpheme_tag.gloss,
    morpheme_tag.title,
    morpheme_tag.description,
    morpheme_tag.role_override as "role_override: WordSegmentRole",
    abstract_morpheme_tag.linguistic_type
  from abbreviation_system
    inner join
      morpheme_tag on abbreviation_system.id = morpheme_tag.system_id
    inner join
      abstract_morpheme_tag on
        abstract_morpheme_tag.id = any(morpheme_tag.abstract_ids)
  where abbreviation_system.short_name = $1
  or abbreviation_system.short_name like 'CUS'
)

select *
from t
order by linguistic_type asc, gloss asc;
