-- Returns the current lock state for a word. All three columns are NULL
-- when the word is not locked or does not exist; a non-null
-- editing_lock_token means the lock is held.
select
    editing_started_at,
    editing_user_id,
    editing_lock_token
from word
where id = $1;
