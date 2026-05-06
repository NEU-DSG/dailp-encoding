-- Returns NULL if the word is not locked or does not exist.
select editing_user_id
from word
where id = $1;
