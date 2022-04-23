select morpheme_gloss.id
from morpheme_gloss
  left join document on document.id = morpheme_gloss.document_id
where morpheme_gloss.gloss = $1 and document.short_name = $2
