select
  abbreviation_system.short_name as system_name,
  morpheme_tag.gloss,
  abstract_morpheme_tag.title,
  abstract_morpheme_tag.description,
  abstract_morpheme_tag.linguistic_type
from morpheme_tag
inner join abstract_morpheme_tag on abstract_morpheme_tag.id = any(morpheme_tag.abstract_ids)
inner join abbreviation_system on abbreviation_system.id = morpheme_tag.system_id
where abbreviation_system.short_name = $1
