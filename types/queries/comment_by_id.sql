select
    comment.id,
    posted_at,
    posted_by,
    u_posted_by.display_name as "posted_by_name",
    text_content,
    edited,
    comment_type as "comment_type: _",
    parent_id,
    parent_type as "parent_type: _"
from comment
join dailp_user u_posted_by on u_posted_by.id = posted_by
where comment.id = $1