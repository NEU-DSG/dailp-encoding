select distinct on (input_gloss) coalesce(internal_gloss, input_gloss) as gloss
from abstract_morpheme_tag
  inner join morpheme_tag
    on array_length(morpheme_tag.abstract_ids, 1) = 1 
      and abstract_morpheme_tag.id = morpheme_tag.abstract_ids[1] 
  inner join abbreviation_system 
    on abbreviation_system.short_name = $2::text 
      and morpheme_tag.system_id = abbreviation_system.id
  right join unnest($1::text[]) as input_gloss
    on input_gloss = morpheme_tag.gloss
order by input_gloss