delete from word_segment
where word_id = $1
and gloss_id in (
  select mg.id from morpheme_gloss mg
  join abstract_morpheme_tag amt on amt.id = mg.tag_id
  where amt.representation_system_type = $2::representation_system_type
);