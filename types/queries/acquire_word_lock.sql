-- Acquire (or refresh) the editing lock on a word.
-- Returns one row if acquired, zero rows if denied.
-- The where clause allows lock acquisition when:
--   1. the lock is free (currently_editing = false), OR
--   2. the existing lock has gone stale (5 minute limit) OR
--   3. the caller already holds it.
-- Args:
--   $1 = word id
--   $2 = user id of the requesting user (stored for display purposes)
--   $3 = client-generated lock token (uuid) identifying this edit session
update word set
    currently_editing = true,
    editing_started_at = now(),
    editing_user_id = $2,
    editing_lock_token = $3
where id = $1
    and (
        currently_editing = false
        or editing_started_at < now() - interval '5 minutes'
        or editing_lock_token = $3
    )
returning id, editing_user_id, editing_lock_token;
