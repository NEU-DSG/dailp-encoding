-- Given the system and the system-specific gloss.
select internal_gloss
from abstract_morpheme_tag
  inner join morpheme_tag on abstract_morpheme_tag.id = morpheme_tag.abstract_ids[1]
  inner join unnest($1::text[]) as input_gloss on input_gloss = morpheme_tag.gloss
  inner join abbreviation_system on abbreviation_system.id = morpheme_tag.system_id
where abbreviation_system.short_name = $2::text