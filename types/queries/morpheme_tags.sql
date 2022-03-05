select
  morpheme_gloss.id as gloss_id,
  morpheme_gloss.example_shape,
  abbreviation_system.short_name as system_name,
  morpheme_tag.gloss,
  abstract_morpheme_tag.title,
  abstract_morpheme_tag.description
from morpheme_gloss
inner join abstract_morpheme_tag on abstract_morpheme_tag.id = morpheme_gloss.tag_id
left join abbreviation_system on abbreviation_system.short_name = any($2)
inner join morpheme_tag on morpheme_tag.abstract_ids[1] = abstract_morpheme_tag.id
where morpheme_gloss.id = any($1)
  and morpheme_tag.system_id = abbreviation_system.id
