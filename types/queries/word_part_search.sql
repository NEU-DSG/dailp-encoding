select
    word_segment.morpheme,
    array_agg(word.document_id) as document_ids
from word_segment
inner join word on word.id = word_segment.word_id
where word_segment.gloss = '3SG.A'
group by word_segment.morpheme
