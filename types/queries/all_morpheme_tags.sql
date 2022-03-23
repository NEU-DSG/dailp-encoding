select * from (
  select distinct on (morpheme_tag.gloss)
    abbreviation_system.short_name as system_name,
    morpheme_tag.gloss,
    morpheme_tag.title,
    abstract_morpheme_tag.description,
    abstract_morpheme_tag.linguistic_type
  from abbreviation_system
    inner join
      morpheme_tag on abbreviation_system.id = morpheme_tag.system_id
    inner join
      abstract_morpheme_tag on
        abstract_morpheme_tag.id = any(morpheme_tag.abstract_ids)
  where abbreviation_system.short_name = $1
) as t
order by linguistic_type asc, gloss asc;
