delete from word_segment
where word_id = $1
and system_id = (select id from abbreviation_system where short_name = $2)