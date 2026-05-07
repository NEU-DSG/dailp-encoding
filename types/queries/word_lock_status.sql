-- Returns the current lock state for a word. The four columns are NULL/false
-- when the word is not locked or does not exist.
select
    currently_editing,
    editing_started_at,
    editing_user_id,
    editing_lock_token
from word
where id = $1;
