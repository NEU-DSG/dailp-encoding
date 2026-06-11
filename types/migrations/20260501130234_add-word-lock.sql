-- Add locking columns to word so two editors cannot edit the
-- same word simultaneously. See acquire_word_lock.sql and release_word_lock.sql
-- for usage. The lock auto-expires after 5 minutes of inactivity (enforced in
-- the where clause of acquire_word_lock.sql). A non-null editing_lock_token
-- means the lock is held; release sets all three columns back to null.
alter table word
    add column editing_started_at timestamptz,
    add column editing_user_id uuid references dailp_user (id) on delete set null,
    add column editing_lock_token uuid;
