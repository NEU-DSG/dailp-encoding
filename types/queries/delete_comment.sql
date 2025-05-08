-- delete a comment given its ID
delete from comment where id = $1 returning id;