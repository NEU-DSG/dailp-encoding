select id, page_id, english_translation
from paragraph
where page_id = any($1)
order by character_range asc
