insert into paragraph (page_id, character_range, english_translation)
values ($1, $2, $3)
returning id
