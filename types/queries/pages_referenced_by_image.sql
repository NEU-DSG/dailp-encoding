-- Content pages whose body refers to image $1.
--
-- Only what a usage list needs to render and link: a page's body would be the
-- largest column here and nothing asking "where is this image used" wants it.
select p.page_id, p.path, p.title
from page_image_reference r
inner join page p on p.page_id = r.page_id
where r.image_id = $1
order by p.title;
