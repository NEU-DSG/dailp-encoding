select
    morpheme,
    count(word_id) as word_count
from word_segment
where gloss = 'PFT'
group by morpheme
order by word_count desc
