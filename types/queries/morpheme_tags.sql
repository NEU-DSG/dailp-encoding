select *
from morpheme_tag
where morpheme_tag.abstract_id = any($1)
