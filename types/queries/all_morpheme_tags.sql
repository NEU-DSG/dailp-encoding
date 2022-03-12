select
  abbreviation_system.short_name as system_name,
  morpheme_tag.gloss,
  abstract_morpheme_tag.title,
  abstract_morpheme_tag.description
from abbreviation_system
inner join morpheme_tag on abbreviation_system.id = morpheme_tag.system_id
inner join abstract_morpheme_tag on abstract_morpheme_tag.id = morpheme_tag.id
where abbreviation_system.short_name = $1
