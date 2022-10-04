-- Selects the internal_gloss if there is one, otherwise 
-- selects the given gloss, a custom gloss entered by the user.
select coalesce(internal_gloss, input_gloss) as gloss
from abstract_morpheme_tag

-- Limits the fields of the table to only those with one abstract id,
-- and which have the same abstract id as the abstract_morpheme_tag table.
  inner join morpheme_tag
    on array_length(morpheme_tag.abstract_ids, 1) = 1 
      and abstract_morpheme_tag.id = morpheme_tag.abstract_ids[1] 

-- Limits the fields of the table to only those with the matching short name
-- as the input and those with the corresponding system id from morpheme_tag.
  inner join abbreviation_system 
    on abbreviation_system.short_name = $2::text 
      and morpheme_tag.system_id = abbreviation_system.id

-- Joins matching glosses with the morpheme_tag table,
-- and keeps the input_gloss even if there is no matching gloss (these will
-- be the custom gloss entered by the user.)
  right join unnest($1::text[]) as input_gloss
    on input_gloss = morpheme_tag.gloss