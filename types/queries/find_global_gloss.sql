select morpheme_gloss.id as gloss_id
from morpheme_gloss
  inner join
    abstract_morpheme_tag as abstract on morpheme_gloss.tag_id = abstract.id
where document_id is null and gloss = $1
