select distinct on (word.id)
  word.*
from morpheme_gloss
  left join morpheme_gloss_relation as rl on rl.left_document_id = morpheme_gloss.document_id and rl.left_gloss = morpheme_gloss.gloss
  left join morpheme_gloss_relation as rr on rr.right_document_id = morpheme_gloss.document_id and rr.right_gloss = morpheme_gloss.gloss
  inner join morpheme_gloss as other on (other.document_id = rl.right_document_id and other.gloss = rl.right_gloss) or (other.document_id = rr.left_document_id and other.gloss = rr.left_gloss)
  inner join word_segment on word_segment.gloss_id = other.id or word_segment.gloss_id = morpheme_gloss.id
  inner join word on word.id = word_segment.word_id
where morpheme_gloss.gloss = $1 and morpheme_gloss.document_id = $2
