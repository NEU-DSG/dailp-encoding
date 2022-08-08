select
  morpheme_gloss.id as gloss_id,
  morpheme_gloss.example_shape,
  abbreviation_system.short_name as system_name,
  morpheme_gloss.gloss as abstract_gloss,
  morpheme_tag.gloss as concrete_gloss,
  morpheme_tag.title,
  morpheme_tag.description,
  morpheme_tag.role_override as "role_override: WordSegmentRole",
  abstract_morpheme_tag.linguistic_type,
  array(
    select abstract_morpheme_tag.internal_gloss
    from unnest(morpheme_tag.abstract_ids) as abstract_id
      inner join abstract_morpheme_tag on abstract_morpheme_tag.id = abstract_id) as internal_tags
from morpheme_gloss
  inner join abstract_morpheme_tag on abstract_morpheme_tag.id = morpheme_gloss.tag_id
  left join abbreviation_system on abbreviation_system.short_name = any($2)
  inner join morpheme_tag on morpheme_tag.abstract_ids[1] = abstract_morpheme_tag.id
where morpheme_gloss.gloss = any($1)
  and morpheme_tag.system_id = abbreviation_system.id
order by array_length(morpheme_tag.abstract_ids, 1) desc
