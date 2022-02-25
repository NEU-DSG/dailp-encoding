SELECT *
FROM morpheme_tag
WHERE morpheme_tag.abstract_id = ANY ($1)
