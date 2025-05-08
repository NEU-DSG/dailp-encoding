-- Insert a new comment from a user
insert into comment (posted_at, posted_by, text_content, parent_id, parent_type, comment_type)
values (now(), $1, $2, $3, $4, $5)
returning id