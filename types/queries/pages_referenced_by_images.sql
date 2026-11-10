-- Content pages whose body refers to each of images $1, by title. Batching
-- keeps a delete warning to one query instead of one per image.
select r.image_id, p.page_id, p.path, p.title
from page_image_reference r
inner join page p on p.page_id = r.page_id
where r.image_id = any($1::uuid[])
order by p.title;
