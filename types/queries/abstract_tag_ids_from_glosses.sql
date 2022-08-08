select abstract_morpheme_tag.id as "id!"
from unnest($1::text[]) as morpheme_gloss
  inner join
    abstract_morpheme_tag on abstract_morpheme_tag.internal_gloss = morpheme_gloss
