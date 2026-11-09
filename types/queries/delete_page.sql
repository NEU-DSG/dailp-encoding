-- delete a page given its id
delete from page where page_id = $1 returning page_id;
