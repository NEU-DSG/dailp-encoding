-- Release the editing lock on a word, but only if the caller currently holds it.
-- The token check ensures users cannot release locks held by another session,
-- including their own sessions on a different device.
-- Parameters:
--   $1 = word id
--   $2 = client lock token
update word set
    editing_started_at = null,
    editing_user_id = null,
    editing_lock_token = null
where id = $1 and editing_lock_token = $2;
